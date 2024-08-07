/**
 * @fileoverview This file defines and exports the request books service functions.
 * These functions handle the creation, retrieval, and deletion of requested books.
 * The service functions interact with the RequestBooksModel to perform database operations
 * and use various utilities for validation and file handling.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import validateFile from '../../../../utilities/validateFile.js';
import requestBooksConstant from './requestBooks.constant.js';
import mimeTypesConstants from '../../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../../constant/fileExtensions.constants.js';
import GoogleDriveService from '../../../../service/googleDrive.service.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import RequestBooksModel from './requestBooks.model.js';
import loggerService from '../../../../service/logger.service.js';

/**
 * @description Handles the creation of a book request. Validates the request data and image,
 * checks for duplicate requests, uploads the image, and saves the request to the database.
 *
 * @param {Object} requester - The user making the request.
 * @param {Object} bookData - The data for the book being requested.
 * @param {Object} bookImage - The image file for the book.
 * @returns {Promise<Object>} - The response indicating the success or failure of the operation.
 */
const createRequestBook = async (requester, bookData, bookImage) => {
    try {
        // Check for existing requestBooks document for the user
        const existingRequest = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (existingRequest) {
            // Check for duplicate book requestBooks
            const isDuplicate = existingRequest.requestBooks.some(
                (book) => book.name === bookData.name
            );
            if (isDuplicate) {
                return errorResponse(
                    'This book has already been requested.',
                    httpStatus.CONFLICT
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
                requestBooksConstant.imageSize,
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

            // Add new book to the existing requestBooks document
            existingRequest.requestBooks.push(bookData);
            await existingRequest.save();

            return sendResponse(
                existingRequest,
                'New book requestBooks added successfully.',
                httpStatus.OK
            );
        } else {
            // Validate the image file
            if (!bookImage) {
                return errorResponse(
                    'Please provide an image.',
                    httpStatus.BAD_REQUEST
                );
            }

            const fileValidationResults = validateFile(
                bookImage,
                requestBooksConstant.imageSize,
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

            // Create a new requestBooks document if none exists
            const newRequest = await RequestBooksModel.create({
                owner: requester,
                requestBooks: [bookData],
            });

            return sendResponse(
                newRequest,
                'Book requested successfully.',
                httpStatus.OK
            );
        }
    } catch (error) {
        loggerService.error(`Failed to request book: ${error}`);

        return errorResponse(
            error.message || 'Failed to request book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @description Retrieves all requested books from the database.
 *
 * @returns {Promise<Object>} - The response containing the list of all requested books.
 */
const getRequestBooks = async () => {
    try {
        const requestBooks = await RequestBooksModel.find()
            .populate({
                path: 'owner',
                select: 'name _id',
            })
            .lean();

        if (!requestBooks || requestBooks.length === 0) {
            return errorResponse(
                'No requested books found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                total: requestBooks.length,
                requestBooks,
            },
            'Successfully retrieved all requested books.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get requested book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get requested book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @description Retrieves a specific requested book by its ID.
 *
 * @param {String} bookId - The ID of the requested book.
 * @returns {Promise<Object>} - The response containing the requested book details.
 */
const getRequestBook = async (bookId) => {
    try {
        // Attempt to find a request document that contains the specific book ID in its requestBooks array
        const request = await RequestBooksModel.findOne({
            'requestBooks._id': bookId, // Adjust this path if your book ID is stored differently
        })
            .populate('owner', 'username email') // Populate owner details; adjust fields as necessary.
            .populate({
                path: 'requestBooks.writer',
                select: 'name biography', // Populate writer details if it is stored as a reference.
            })
            .exec();

        // Check if the request was found
        if (!request) {
            return errorResponse(
                'Requested book not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Extract the specific requested book from the requestBooks array
        const requestedBook = request.requestBooks.find(
            (book) => book._id.toString() === bookId
        );

        // Return the requested book if found
        if (!requestedBook) {
            return errorResponse(
                'Requested book not found in the document.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            requestedBook,
            'Successfully retrieved the requested book.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get requested book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get requested book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @description Retrieves all requested books for a specific owner.
 *
 * @param {String} ownerId - The ID of the owner.
 * @returns {Promise<Object>} - The response containing the list of requested books for the owner.
 */
const getRequestedBooksByOwnerId = async (ownerId) => {
    try {
        // Fetch all request documents for a specific owner
        const requests = await RequestBooksModel.find({ owner: ownerId })
            .populate('owner', 'username email') // Populate owner details; adjust fields as necessary.
            .populate({
                path: 'requestBooks.writer',
                select: 'name biography', // Populate writer details if it is stored as a reference.
            })
            .exec();

        // Check if there are any requests found
        if (!requests.length) {
            return errorResponse(
                'No requested books found for this user.',
                httpStatus.NOT_FOUND
            );
        }

        // Compile all requested books into one array
        const allRequestBooks = requests.flatMap((request) =>
            request.requestBooks.map((book) => ({
                ...book.toObject(),
                owner: request.owner.username, // Optionally include owner details in each book.
            }))
        );

        return sendResponse(
            {
                total: allRequestBooks.length,
                requestBooks: allRequestBooks,
            },
            'Successfully retrieved requested books for the specified user.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get requested book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get requested book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * @description Deletes a requested book by its ID.
 *
 * @param {Object} requester - The user making the request.
 * @param {String} requestBookId - The ID of the requested book to be deleted.
 * @returns {Promise<Object>} - The response indicating the success or failure of the operation.
 */
const deleteRequestBook = async (requester, requestBookId) => {
    try {
        const requestBook = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (!requestBook) {
            return errorResponse(
                'No book requestBooks found to delete.',
                httpStatus.NOT_FOUND
            );
        }

        // Remove the requested book by ID from the array
        const index = requestBook.requestBooks.findIndex(
            (book) => book._id.toString() === requestBookId
        );
        if (index > -1) {
            requestBook.requestBooks.splice(index, 1);

            await requestBook.save();

            return sendResponse(
                {
                    removedBookId: requestBookId,
                },
                'Book requestBooks removed successfully.',
                httpStatus.OK
            );
        } else {
            return errorResponse(
                'Book requestBooks not found in your records.',
                httpStatus.NOT_FOUND
            );
        }
    } catch (error) {
        loggerService.error(`Failed to delete requested book: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete requested book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * requestBooksService - An object that holds the service functions for request books-related operations.
 * These functions handle the creation, retrieval, and deletion of requested books.
 *
 * @typedef {Object} RequestBooksService
 * @property {Function} createRequestBook - Handles the creation of a book request.
 * @property {Function} getRequestBooks - Retrieves all requested books.
 * @property {Function} getRequestBook - Retrieves a specific requested book by its ID.
 * @property {Function} getRequestedBooksByOwnerId - Retrieves all requested books for a specific owner.
 * @property {Function} deleteRequestBook - Deletes a requested book by its ID.
 */
const writersService = {
    createRequestBook,
    getRequestBooks,
    getRequestBook,
    getRequestedBooksByOwnerId,
    deleteRequestBook,
};

export default writersService;
