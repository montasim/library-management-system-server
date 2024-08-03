import BooksModel from './books.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import GoogleDriveService from '../../../service/googleDrive.service.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../constant/fileExtensions.constants.js';
import booksConstant from './books.constant.js';
import SubjectsModel from '../subjects/subjects.model.js';
import PublicationsModel from '../publications/publications.model.js';
import WritersModel from '../writers/writers.model.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';

// Helper function to validate IDs
const validateIds = async (writer, publication) => {
    const errors = [];

    // Validate writer
    if (writer && !(await WritersModel.findById(writer))) {
        errors.push(`Invalid writer ID: ${writer}`);
    }

    // Validate publication
    if (publication && !(await PublicationsModel.findById(publication))) {
        errors.push(`Invalid publication ID: ${publication}`);
    }

    return errors;
};

// Helper function to validate subject IDs
const validateSubjectIds = async (subjectIds) => {
    const subjectErrors = [];

    if (subjectIds?.length) {
        for (const subjectId of subjectIds) {
            if (!(await SubjectsModel.findById(subjectId))) {
                subjectErrors.push(`Invalid subject ID: ${subjectId}`);
            }
        }
    }

    return subjectErrors;
};

const populateBookFields = async (query) => {
    return await query
        .populate({
            path: 'writer',
            select: '-createdBy -updatedBy'
        })
        .populate({
            path: 'publication',
            select: '-createdBy -updatedBy'
        })
        .populate({
            path: 'subject',
            select: '-createdBy -updatedBy'
        })
        .select('-createdBy -updatedBy');
};

const bookListParamsMapping = {
    bookPage: 'page', // Mapping 'bookPage' from the API to 'page' in the database
};

/**
 * Creates a new book in the database with image upload and detailed data validation.
 *
 * @param {string} requester - The ID of the user requesting the creation, used to verify admin permissions.
 * @param {Object} bookData - The data of the book to be created. Should include fields like name, writer, publication, etc.
 * @param {Object} bookImage - The image file associated with the book, which will be uploaded to Google Drive.
 * @returns {Promise<Object>} - A promise that resolves to the response object indicating the result of the operation.
 */
const createNewBook = async (requester, bookData, bookImage) => {
    try {
        // Check if book name already exists
        const exists = await BooksModel.findOne({
            name: bookData.name,
        }).lean();
        if (exists) {
            return sendResponse(
                {},
                `Books name "${bookData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        // Validate writer, publication, and subject IDs
        const validationErrors = [
            ...(await validateIds(bookData.writer, bookData.publication)),
            ...(await validateSubjectIds(bookData.subject)),
        ];
        if (validationErrors.length) {
            return sendResponse(
                {},
                validationErrors.join(' '),
                httpStatus.BAD_REQUEST
            );
        }

        // Validate the image file
        if (!bookImage) {
            return errorResponse(
                'Please provide an image.',
                httpStatus.BAD_REQUEST
            );
        }

        const fileValidationResults = validateFile(
            bookImage,
            booksConstant.imageSize,
            [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
            [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
        );
        if (!fileValidationResults.isValid) {
            return errorResponse(
                fileValidationResults.message,
                httpStatus.BAD_REQUEST
            );
        }

        // Upload image and handle possible errors
        const bookImageData = await GoogleDriveService.uploadFile(bookImage);
        if (!bookImageData || bookImageData instanceof Error) {
            return errorResponse(
                'Failed to save image.',
                httpStatus.INTERNAL_SERVER_ERROR
            );
        }

        // Add the extra data
        bookData.image = bookImageData;
        bookData.createdBy = requester;

        // Create the book
        const newBook = await BooksModel.create(bookData);

        // Get the populated book datapo
        const newBookDetails = await populateBookFields(
            BooksModel.findById(newBook._id)
        );

        // Send success response
        return sendResponse(
            newBookDetails,
            'Book created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create book: ${error}`);

        return errorResponse(
            error.message || 'Failed to create book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getBookList = async (params) => {
    return service.getResourceList(BooksModel, populateBookFields, params, bookListParamsMapping, 'Book');
};

const getBookById = async (bookId) => {
    return service.getResourceById(BooksModel, populateBookFields, bookId, 'Book');
};

/**
 * Updates an existing book record with new data and possibly a new image.
 *
 * @param {string} requester - The ID of the user making the update requestBooks.
 * @param {string} bookId - The ID of the book to update.
 * @param {Object} updateData - Data to update the book with.
 * @param {Object} bookImage - New image for the book, if provided.
 * @returns {Promise<Object>} - The updated book details or an error response.
 */
const updateBookById = async (requester, bookId, updateData, bookImage) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        const { writer, addSubject, deleteSubject, publication } = updateData;
        const errors = await validateIds(writer, publication);

        if (errors.length) {
            return errorResponse(errors.join(' '), httpStatus.BAD_REQUEST);
        }

        const addSubjectErrors = await validateSubjectIds(addSubject);
        const deleteSubjectErrors = await validateSubjectIds(deleteSubject);

        if (addSubjectErrors.length || deleteSubjectErrors.length) {
            return errorResponse(
                [...addSubjectErrors, ...deleteSubjectErrors].join(' '),
                httpStatus.BAD_REQUEST
            );
        }

        // Ensure no overlap between addSubject and deleteSubject
        if (addSubject && deleteSubject) {
            const overlappingSubjects = addSubject.filter((subject) =>
                deleteSubject.includes(subject)
            );
            if (overlappingSubjects.length) {
                return errorResponse(
                    `The following subjects are in both addSubject and deleteSubject: ${overlappingSubjects.join(', ')}`,
                    httpStatus.BAD_REQUEST
                );
            }
        }

        updateData.updatedBy = requester;

        // Find the current book
        const book = await BooksModel.findById(bookId);

        if (!book) {
            return errorResponse('Book not found.', httpStatus.NOT_FOUND);
        }

        // Ensure book.subject is an array
        if (!Array.isArray(book.subject)) {
            book.subject = [];
        }

        const existingSubjects = [];
        const newSubjects = [];

        // Handle adding subjects
        if (addSubject?.length) {
            addSubject.forEach((subject) => {
                if (book.subject.includes(subject)) {
                    existingSubjects.push(subject);
                } else {
                    newSubjects.push(subject);
                }
            });

            if (existingSubjects.length) {
                return errorResponse(
                    `The following subjects already exist: ${existingSubjects.join(', ')}`,
                    httpStatus.BAD_REQUEST
                );
            }

            book.subject.push(...newSubjects);
        }

        // Handle deleting subjects
        if (deleteSubject && deleteSubject.length) {
            book.subject = book.subject.filter(
                (subject) => !deleteSubject.includes(subject.toString())
            );
        }

        // Update other fields
        const {
            addSubject: _,
            deleteSubject: __,
            ...otherUpdates
        } = updateData;

        Object.assign(book, otherUpdates);

        let bookImageData = {};

        // Handle file update
        if (bookImage) {
            const fileValidationResults = validateFile(
                bookImage,
                booksConstant.imageSize,
                [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
                [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
            );
            if (!fileValidationResults.isValid) {
                return errorResponse(
                    fileValidationResults.message,
                    httpStatus.BAD_REQUEST
                );
            }

            // Delete the old file from Google Drive if it exists
            const oldFileId = book.image?.fileId;
            if (oldFileId) {
                await GoogleDriveService.deleteFile(oldFileId);
            }

            bookImageData = await GoogleDriveService.uploadFile(bookImage);

            if (!bookImageData || bookImageData instanceof Error) {
                return errorResponse(
                    'Failed to save image.',
                    httpStatus.INTERNAL_SERVER_ERROR
                );
            }

            bookImageData = {
                fileId: bookImageData.fileId,
                shareableLink: bookImageData.shareableLink,
                downloadLink: bookImageData.downloadLink,
            };

            if (bookImageData) {
                updateData.image = bookImageData;
            }
        }

        await book.save();

        const updatedBookDetails = await populateBookFields(
            BooksModel.findById(bookId)
        );

        return sendResponse(
            updatedBookDetails,
            'Book updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update book: ${error}`);

        return errorResponse(
            error.message || 'Failed to update book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteBookById = async (requester, bookId) => {
    return service.deleteResourceById(requester, BooksModel, bookId, 'book');
};

const deleteBookList = async (requester, bookIds) => {
    return await service.deleteResourcesByList(requester, BooksModel, bookIds, 'books');
};

const booksService = {
    createNewBook,
    getBookList,
    getBookById,
    updateBookById,
    deleteBookById,
    deleteBookList,
};

export default booksService;
