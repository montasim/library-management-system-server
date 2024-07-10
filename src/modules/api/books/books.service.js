import BooksModel from './books.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';
import GoogleDriveFileOperations from '../../../utilities/googleDriveFileOperations.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../constant/fileExtensions.constants.js';
import booksConstant from './books.constant.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import SubjectsModel from '../subjects/subjects.model.js';
import PublicationsModel from '../publications/publications.model.js';
import WritersModel from '../writers/writers.model.js';

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

const createBook = async (requester, bookData, bookImage) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to create book.',
            httpStatus.FORBIDDEN
        );
    }

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

    const { writer, subject, publication } = bookData;
    const errors = await validateIds(writer, publication);
    if (errors.length) {
        return sendResponse(
            {},
           errors.join(' '),
            httpStatus.BAD_REQUEST
        );
    }

    const subjectErrors = await validateSubjectIds(subject);
    if (subjectErrors.length) {
        return sendResponse(
            {},
            errors.join(' '),
            httpStatus.BAD_REQUEST
        );
    }

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

    const bookImageData =
        await GoogleDriveFileOperations.uploadFile(bookImage);
    if (!bookImageData || bookImageData instanceof Error) {
        return errorResponse(
            'Failed to save image.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }

    bookData.createdBy = requester;

    const newBook = await BooksModel.create({
        ...bookData,
        image: bookImageData,
    });

    return sendResponse(
        newBook,
        'Book created successfully.',
        httpStatus.CREATED
    );
};

const getBooks = async (params) => {
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
        ...(stockAvailable && { stockAvailable: new RegExp(stockAvailable, 'i') }),
        ...(isActive && { isActive: new RegExp(isActive, 'i') }),
        ...(createdBy && { createdBy }),
        ...(updatedBy && { updatedBy }),
        ...(createdAt && { createdAt }),
        ...(updatedAt && { updatedAt }),
    };
    const totalBooks = await BooksModel.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limit);
    const books = await BooksModel.find(query)
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
};

const getBook = async (bookId) => {
    const book = await BooksModel.findById(bookId);
    if (!book) {
        return errorResponse('Book not found.', httpStatus.NOT_FOUND);
    }

    return sendResponse(book, 'Book fetched successfully.', httpStatus.OK);
};

const updateBook = async (requester, bookId, updateData, bookImage) => {
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
            throw new Error(errors.join(' '));
        }

        const addSubjectErrors = await validateSubjectIds(addSubject);
        const deleteSubjectErrors = await validateSubjectIds(deleteSubject);

        if (addSubjectErrors.length || deleteSubjectErrors.length) {
            throw new Error(
                [...addSubjectErrors, ...deleteSubjectErrors].join(' ')
            );
        }

        // Ensure no overlap between addSubject and deleteSubject
        if (addSubject && deleteSubject) {
            const overlappingSubjects = addSubject.filter((subject) =>
                deleteSubject.includes(subject)
            );

            if (overlappingSubjects.length) {
                throw new Error(
                    `The following subjects are in both addSubject and deleteSubject: ${overlappingSubjects.join(', ')}`
                );
            }
        }

        updateData.updatedBy = requester;

        // Find the current book
        const book = await BooksModel.findById(bookId);

        if (!book) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Book not found.',
                status: httpStatus.NOT_FOUND,
            };
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
                throw new Error(
                    `The following subjects already exist: ${existingSubjects.join(', ')}`
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
                await GoogleDriveFileOperations.deleteFile(oldFileId);
            }

            bookImageData =
                await GoogleDriveFileOperations.uploadFile(bookImage);

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

        const updatedBook = await book.save();

        return {
            timeStamp: new Date(),
            success: true,
            data: updatedBook,
            message: 'Book updated successfully.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error updating the book.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const deleteBooks = async (requester, bookIds) => {
    const isAuthorized = await validateUserRequest(requester);

    if (!isAuthorized) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'User not authorized.',
            status: httpStatus.FORBIDDEN,
        };
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
                await GoogleDriveFileOperations.deleteFile(oldFileId);
            }

            const deletedBook =
                await BooksModel.findByIdAndDelete(bookId);

            if (deletedBook) {
                results.deleted.push(bookId);
            }
        } catch (error) {
            // Log the error and mark this ID as failed
            logger.error(
                `Failed to delete book with ID ${bookId}: ${error}`
            );
            results.failed.push(bookId);
        }
    }

    return {
        timeStamp: new Date(),
        success: results.failed.length === 0, // Success only if there were no failures
        data: results,
        message: `Deleted ${results.deleted.length}, Not found ${results.notFound.length}, Failed ${results.failed.length}`,
        status: httpStatus.OK,
    };
};

const deleteBook = async (requester, bookId) => {
    return deleteResourceById(
        requester,
        bookId,
        BooksModel,
        'book'
    );
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
