/**
 * @fileoverview This file defines the service functions for handling operations related to user-requested books.
 * The services include methods to retrieve the list of requested books for a user, fetch details of a specific
 * requested book, and delete a specific requested book. These functions interact with the `RequestBooksModel`
 * and handle data retrieval, manipulation, error responses, and logging.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import RequestBooksModel from '../../books/request/requestBooks.model.js';
import loggerService from '../../../../service/logger.service.js';

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
        const requestBooks = await RequestBooksModel.findOne({
            owner: requester,
        });

        if (!requestBooks || requestBooks.requestBooks.length === 0) {
            return sendResponse(
                {},
                'You have not requested any book yet.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                total: requestBooks.requestBooks.length,
                requestBooks: requestBooks.requestBooks,
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
        const requestBook = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (!requestBook) {
            return errorResponse(
                'No book request found to delete.',
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
                'Book request removed successfully.',
                httpStatus.OK
            );
        } else {
            return errorResponse(
                'Book request not found in your records.',
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

const writersService = {
    getRequestBooks,
    getRequestBook,
    deleteRequestBook,
};

export default writersService;
