/**
 * @fileoverview This file defines and exports the request books service functions.
 * These functions handle the creation, retrieval, and deletion of requested books.
 * The service functions interact with the RequestBooksModel to perform database operations
 * and use various utilities for validation and file handling.
 */

import { v2 as cloudinary } from 'cloudinary';

import httpStatus from '../../../../constant/httpStatus.constants.js';
import requestBooksConstant from './requestBooks.constant.js';
import mimeTypesConstants from '../../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../../constant/fileExtensions.constants.js';
import RequestBooksModel from './requestBooks.model.js';
import loggerService from '../../../../service/logger.service.js';
import configuration from '../../../../configuration/configuration.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import validateFile from '../../../../utilities/validateFile.js';
import sendResponse from '../../../../utilities/sendResponse.js';

cloudinary.config({
    cloud_name: configuration.cloudinary.cloudName,
    api_key: configuration.cloudinary.apiKey,
    api_secret: configuration.cloudinary.apiSecret,
});

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
        // Check for existing requestedBooks document for the user
        let existingRequest = await RequestBooksModel.findOne({
            owner: requester,
        }).populate('owner', 'name image isActive'); // Populate owner data

        if (existingRequest) {
            // Check for duplicate book requestedBooks
            const isDuplicate = existingRequest.requestedBooks.some(
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

            const file = bookImage;
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                {
                    folder: 'library-management-system-server',
                    public_id: file.originalname,
                }
            );

            // Update image data in bookData
            bookData.image = {
                fileId: result?.asset_id,
                shareableLink: result?.secure_url,
                downloadLink: result.url,
            };
            bookData.createdBy = requester;

            // Add new book to the existing requestedBooks document
            existingRequest.requestedBooks.push(bookData);
            await existingRequest.save();

            // Re-populate owner data after save
            existingRequest = await RequestBooksModel.findById(
                existingRequest._id
            ).populate('owner', 'name image isActive');

            return sendResponse(
                existingRequest,
                'New book requested book successfully.',
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

            const file = bookImage;
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                {
                    folder: 'library-management-system-server',
                    public_id: file.originalname,
                }
            );

            // Update image data in bookData
            bookData.image = {
                fileId: result?.asset_id,
                shareableLink: result?.secure_url,
                downloadLink: result.url,
            };
            bookData.createdBy = requester;

            // Create a new requestedBooks document if none exists
            const newRequest = await RequestBooksModel.create({
                owner: requester,
                requestedBooks: [bookData],
            });

            // Populate owner data after creation
            const populatedRequest = await RequestBooksModel.findById(
                newRequest._id
            ).populate('owner', 'name image isActive');

            return sendResponse(
                populatedRequest,
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
        const requestedBooks = await RequestBooksModel.find()
            .populate({
                path: 'owner',
                select: 'name _id',
            })
            .lean();

        if (!requestedBooks || requestedBooks.length === 0) {
            return errorResponse(
                'No requested books found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                total: requestedBooks.length,
                requestedBooks,
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
        // Attempt to find a request document that contains the specific book ID in its requestedBooks array
        const request = await RequestBooksModel.findOne({
            'requestedBooks._id': bookId, // Adjust this path if your book ID is stored differently
        })
            .populate('owner', 'username email') // Populate owner details; adjust fields as necessary.
            .populate({
                path: 'requestedBooks.writer',
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

        // Extract the specific requested book from the requestedBooks array
        const requestedBook = request.requestedBooks.find(
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
                path: 'requestedBooks.writer',
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
            request.requestedBooks.map((book) => ({
                ...book.toObject(),
                owner: request.owner.username, // Optionally include owner details in each book.
            }))
        );

        return sendResponse(
            {
                total: allRequestBooks.length,
                requestedBooks: allRequestBooks,
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
                'No book requested books found to delete.',
                httpStatus.NOT_FOUND
            );
        }

        // Remove the requested book by ID from the array
        const index = requestBook.requestedBooks.findIndex(
            (book) => book._id.toString() === requestBookId
        );
        if (index > -1) {
            requestBook.requestedBooks.splice(index, 1);

            await requestBook.save();

            return sendResponse(
                {
                    removedBookId: requestBookId,
                },
                'Book requested books removed successfully.',
                httpStatus.OK
            );
        } else {
            return errorResponse(
                'Book requested books not found in your records.',
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
