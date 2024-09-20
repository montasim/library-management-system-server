/**
 * @fileoverview This file defines the service functions for handling operations related to user-lent books.
 * The services include methods to retrieve the list of lent books for a user, fetch details of a specific
 * lent book. These functions interact with the `LentBooksModel`
 * and handle data retrieval, manipulation, error responses, and logging.
 */

import httpStatus from '../../../../../constant/httpStatus.constants.js';
import LentBooksModel from '../../../books/lend/lendBooks.model.js';
import loggerService from '../../../../../service/logger.service.js';

import errorResponse from '../../../../../utilities/errorResponse.js';
import sendResponse from '../../../../../utilities/sendResponse.js';

/**
 * Retrieves the list of lent books for the requesting user.
 *
 * This function fetches all books lent by the authenticated requester from the `LentBooksModel`.
 * It sends a response with the total number of lent books and the list of lent books.
 * If no books are found, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name getLentBooks
 * @param {string} requester - The ID of the user requesting the list of lent books.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the list of lent books or an error message.
 */
const getLentBooks = async (requester) => {
    try {
        const requestBooks = await LentBooksModel.findOne({
            owner: requester,
        });

        if (!requestBooks || requestBooks.requestBooks.length === 0) {
            return sendResponse(
                {},
                'You have not lent any book yet.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                total: requestBooks.requestBooks.length,
                requestBooks: requestBooks.requestBooks,
            },
            'Successfully retrieved your lent books.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get lent books: ${error}`);

        return errorResponse(
            error.message || 'Failed to get lent books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves details of a specific lent book identified by its ID.
 *
 * This function fetches the details of a specific book lent by the authenticated requester from the `LentBooksModel`.
 * It searches for the book in the user's lent books list and sends a response with the book details.
 * If the book is not found, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name getLentBook
 * @param {string} requester - The ID of the user requesting the book details.
 * @param {string} requestBookId - The ID of the lent book.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the book details or an error message.
 */
const getLentBook = async (requester, requestBookId) => {
    try {
        // Retrieve the whole document of requests from the specific user
        const requestBooks = await LentBooksModel.findOne({
            owner: requester,
        });
        if (!requestBooks) {
            return errorResponse(
                'No book requests found for this user.',
                httpStatus.NOT_FOUND
            );
        }

        // Find the specific book request in the array of request
        const bookLent = requestBooks.requestBooks.find((book) => {
            return book._id.toString() === requestBookId;
        });
        if (!bookLent) {
            return errorResponse(
                'Book request not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Return the found book request
        return sendResponse(
            bookLent,
            'Successfully retrieved the book request.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get lent book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get lent book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const writersService = {
    getLentBooks,
    getLentBook,
};

export default writersService;
