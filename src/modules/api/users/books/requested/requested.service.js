/**
 * @fileoverview This file defines the service functions for handling operations related to user-requested books.
 * The services include methods to retrieve the list of requested books for a user, fetch details of a specific
 * requested book, and delete a specific requested book. These functions interact with the `RequestBooksModel`
 * and handle data retrieval, manipulation, error responses, and logging.
 */

import mongoose from 'mongoose';

import httpStatus from '../../../../../constant/httpStatus.constants.js';
import errorResponse from '../../../../../utilities/errorResponse.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import RequestBooksModel from '../../../books/request/requestBooks.model.js';
import loggerService from '../../../../../service/logger.service.js';

/**
 * Retrieves the list of requested books for the requesting user.
 *
 * This function fetches all books requested by the authenticated requester from the `RequestBooksModel`.
 * It sends a response with the total number of requested books and the list of requested books.
 * If no books are found, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name getRequestBooks
 * @param {string} requester - The ID of the user requesting the list of requested books.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the list of requested books or an error message.
 */
const getRequestBooks = async (requester) => {
    try {
        // Check if the requester ID is valid and perform aggregation
        const requestedBooks = await RequestBooksModel.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(requester),
                },
            },
            {
                $project: {
                    books: '$requestedBooks', // Rename requestedBooks to books for clarity
                },
            },
            {
                $addFields: {
                    total: { $size: '$books' }, // Calculate the total number of books
                },
            },
        ]);

        // Check if no books were found
        if (!requestedBooks.length || !requestedBooks[0].books.length) {
            return sendResponse(
                {},
                'You have not requested any book yet.',
                httpStatus.OK
            );
        }

        // Respond with the found books and their total count
        return sendResponse(
            {
                total: requestedBooks[0].total,
                books: requestedBooks[0].books,
            },
            'Successfully retrieved your requested books.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get requested books: ${error}`);

        return errorResponse(
            error.message || 'Failed to get requested books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves details of a specific requested book identified by its ID.
 *
 * This function fetches the details of a specific book requested by the authenticated requester from the `RequestBooksModel`.
 * It searches for the book in the user's requested books list and sends a response with the book details.
 * If the book is not found, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name getRequestBook
 * @param {string} requester - The ID of the user requesting the book details.
 * @param {string} requestBookId - The ID of the requested book.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the book details or an error message.
 */
const getRequestBook = async (requester, requestBookId) => {
    try {
        // Retrieve the whole document of requests from the specific user
        const requestBooks = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (!requestBooks) {
            return errorResponse(
                'No book requests found for this user.',
                httpStatus.NOT_FOUND
            );
        }

        // Find the specific book request in the array of request
        const bookRequest = requestBooks.requestBooks.find((book) => {
            return book._id.toString() === requestBookId;
        });
        if (!bookRequest) {
            return errorResponse(
                'Book request not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Return the found book request
        return sendResponse(
            bookRequest,
            'Successfully retrieved the book request.',
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
 * Deletes a specific requested book identified by its ID.
 *
 * This function removes a specific book from the list of books requested by the authenticated requester in the `RequestBooksModel`.
 * It searches for the book in the user's requested books list and removes it. If the book is found and removed, it sends a success response.
 * If the book is not found, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name deleteRequestBook
 * @param {string} requester - The ID of the user requesting the deletion.
 * @param {string} requestBookId - The ID of the requested book to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to the response object confirming the deletion or an error message.
 */
const deleteRequestBook = async (requester, requestBookId) => {
    try {
        // Find the request book document belonging to the requester
        const requestBook = await RequestBooksModel.findOne({
            owner: requester,
        });

        // Check if the requested book record exists
        if (!requestBook) {
            return errorResponse(
                'No book request found to delete.',
                httpStatus.NOT_FOUND
            );
        }

        // Use MongoDB's $pull operator to remove the specific book from requestedBooks array
        const updatedRequestBook = await RequestBooksModel.findOneAndUpdate(
            {
                owner: requester,
                'requestedBooks._id': requestBookId,
            },
            {
                $pull: {
                    requestedBooks: { _id: requestBookId },
                },
            },
            {
                new: true,
            }
        );

        // If the book was not found or deleted, return a not found response
        if (!updatedRequestBook) {
            return errorResponse(
                'Book request not found in your records.',
                httpStatus.NOT_FOUND
            );
        }

        // Send success response
        return sendResponse(
            {
                removedBookId: requestBookId,
            },
            'Book request removed successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to delete requested book: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete requested book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const writersService = {
    getRequestBooks,
    getRequestBook,
    deleteRequestBook,
};

export default writersService;
