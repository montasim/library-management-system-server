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
import validateAdminRequest from '../../../utilities/validateAdminRequest.js';
import loggerService from '../../../service/logger.service.js';

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

/**
 * Creates a new book in the database with image upload and detailed data validation.
 *
 * @param {string} requester - The ID of the user requesting the creation, used to verify admin permissions.
 * @param {Object} bookData - The data of the book to be created. Should include fields like name, writer, publication, etc.
 * @param {Object} bookImage - The image file associated with the book, which will be uploaded to Google Drive.
 * @returns {Promise<Object>} - A promise that resolves to the response object indicating the result of the operation.
 */
const createBook = async (requester, bookData, bookImage) => {
    try {
        // Validate admin permission
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create book.',
                httpStatus.FORBIDDEN
            );
        }

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
        const bookImageData =
            await GoogleDriveService.uploadFile(bookImage);
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

        // Get the populated book data
        const newBookDetails = await BooksModel.findById(newBook._id)
            .populate({ path: 'writer', select: '-createdBy -updatedBy' })
            .populate({ path: 'publication', select: '-createdBy -updatedBy' })
            .populate({ path: 'subject', select: '-createdBy -updatedBy' })
            .select('-createdBy -updatedBy');

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

const getBooks = async (params) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            name,
            bestSeller,
            review,
            writer,
            subject,
            publication,
            edition,
            summary,
            price,
            stockAvailable,
            isActive,
            createdBy,
            updatedBy,
            createdAt,
            updatedAt,
        } = params;
        const query = {
            ...(name && { name: new RegExp(name, 'i') }),
            ...(bestSeller && { bestSeller: new RegExp(bestSeller, 'i') }),
            ...(review && { review: new RegExp(review, 'i') }),
            ...(writer && { writer: new RegExp(writer, 'i') }),
            ...(subject && { subject: new RegExp(subject, 'i') }),
            ...(publication && { publication: new RegExp(publication, 'i') }),
            ...(edition && { edition: new RegExp(edition, 'i') }),
            ...(summary && { summary: new RegExp(summary, 'i') }),
            ...(price && { price: new RegExp(price, 'i') }),
            ...(stockAvailable && {
                stockAvailable: new RegExp(stockAvailable, 'i'),
            }),
            ...(isActive && { isActive: new RegExp(isActive, 'i') }),
            ...(createdBy && { createdBy }),
            ...(updatedBy && { updatedBy }),
            ...(createdAt && { createdAt }),
            ...(updatedAt && { updatedAt }),
        };
        const totalBooks = await BooksModel.countDocuments(query);
        const totalPages = Math.ceil(totalBooks / limit);
        const books = await BooksModel.find(query)
            .populate({ path: 'writer', select: '-createdBy -updatedBy' })
            .populate({ path: 'publication', select: '-createdBy -updatedBy' })
            .populate({ path: 'subject', select: '-createdBy -updatedBy' })
            .select('-createdBy -updatedBy')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!books.length) {
            return sendResponse({}, 'No book found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            {
                books,
                totalBooks,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${books.length} books fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get books: ${error}`);

        return errorResponse(
            error.message || 'Failed to get books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getBook = async (bookId) => {
    try {
        const book = await BooksModel.findById(bookId)
            .populate({ path: 'writer', select: '-createdBy -updatedBy' })
            .populate({ path: 'publication', select: '-createdBy -updatedBy' })
            .populate({ path: 'subject', select: '-createdBy -updatedBy' })
            .select('-createdBy -updatedBy');

        if (!book) {
            return errorResponse('Book not found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(book, 'Book fetched successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to get book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
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
const updateBook = async (requester, bookId, updateData, bookImage) => {
    try {
        // Validate admin permission
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create book.',
                httpStatus.FORBIDDEN
            );
        }

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

            bookImageData =
                await GoogleDriveService.uploadFile(bookImage);

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

        const updatedBookDetails = await BooksModel.findById(bookId)
            .populate({ path: 'writer', select: '-createdBy -updatedBy' })
            .populate({ path: 'publication', select: '-createdBy -updatedBy' })
            .populate({ path: 'subject', select: '-createdBy -updatedBy' })
            .select('-createdBy -updatedBy');

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

const deleteBooks = async (requester, bookIds) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse('User not authorized.', httpStatus.FORBIDDEN);
        }

        const results = {
            deleted: [],
            notFound: [],
            failed: [],
        };

        // Process each bookId
        for (const bookId of bookIds) {
            try {
                const book = await BooksModel.findById(bookId).lean();

                if (!book) {
                    results.notFound.push(bookId);
                }

                // Delete the old file from Google Drive if it exists
                const oldFileId = book.image?.fileId;
                if (oldFileId) {
                    await GoogleDriveService.deleteFile(oldFileId);
                }

                const deletedBook = await BooksModel.findByIdAndDelete(bookId);

                if (deletedBook) {
                    results.deleted.push(bookId);
                }
            } catch (error) {
                // Log the error and mark this ID as failed
                loggerService.error(
                    `Failed to delete book with ID ${bookId}: ${error}`
                );
                results.failed.push(bookId);
            }
        }

        return sendResponse(
            results,
            `Deleted ${results.deleted.length}, Not found ${results.notFound.length}, Failed ${results.failed.length}`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to delete books: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteBook = async (requester, bookId) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                `You are not authorized to delete book.`,
                httpStatus.FORBIDDEN
            );
        }

        const deletedResource = await BooksModel.findByIdAndDelete(bookId);
        if (!deletedResource) {
            return sendResponse({}, 'Book not found.', httpStatus.NOT_FOUND);
        }

        return sendResponse({}, 'Book deleted successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to delete book: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const booksService = {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBooks,
    deleteBook,
};

export default booksService;
