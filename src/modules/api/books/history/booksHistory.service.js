/**
 * @fileoverview This file defines and exports the service functions for handling books history operations.
 * These functions include retrieving the history of all books and retrieving the history of a specific book.
 * The service functions utilize Mongoose models and various utilities for error handling, response formatting, and logging.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import BooksHistoryModel from './booksHistory.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import loggerService from '../../../../service/logger.service.js';

/**
 * getBooksHistory - Retrieves the history of books based on provided query parameters.
 * Constructs a query based on the provided parameters, fetches the books history, and returns the results with pagination and sorting.
 *
 * @async
 * @function
 * @param {Object} params - The query parameters for retrieving books history.
 * @param {number} params.page - The page number for pagination.
 * @param {number} params.limit - The limit for the number of records per page.
 * @param {string} params.sort - The sorting field and order.
 * @param {ObjectId} params.bookId - The ID of the book to filter by.
 * @param {ObjectId} params.user - The ID of the user to filter by.
 * @param {string} params.from - The start date for filtering the lending period.
 * @param {string} params.to - The end date for filtering the lending period.
 * @returns {Promise<Object>} The response object containing the books history records, pagination details, and a status message.
 */
const getBooksHistory = async (params) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt', // Default sort by most recent creation
            bookId,
            user,
            from,
            to,
            ...otherFilters
        } = params;

        const query = {};

        // Constructing query filters based on parameters
        if (bookId) query.book = bookId;
        if (user) query['lend.user'] = user;
        if (from) query['lend.from'] = { $gte: new Date(from) };
        if (to) query['lend.to'] = { $lte: new Date(to) };

        // Step 2: Fetch the books history based on the query
        const totalHistory = await BooksHistoryModel.countDocuments(query);
        const totalPages = Math.ceil(totalHistory / limit);

        // Adjust the limit if it exceeds the total number of history records
        const adjustedLimit = Math.min(
            limit,
            totalHistory - (page - 1) * limit
        );

        const booksHistory = await BooksHistoryModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit)
            .populate({
                path: 'book',
                select: '-createdBy -updatedBy',
                populate: [
                    {
                        path: 'writer',
                        model: 'Writers',
                        select: '-createdBy -updatedBy',
                    },
                    {
                        path: 'subject',
                        model: 'Subjects',
                        select: '-createdBy -updatedBy',
                    },
                    {
                        path: 'publication',
                        model: 'Publications',
                        select: '-createdBy -updatedBy',
                    },
                ],
            })
            .populate({
                path: 'lend.user return.user',
                select: 'name email image',
            })
            .lean();

        // Check if no data was found
        if (!booksHistory || booksHistory.length === 0) {
            return sendResponse({}, 'No books history found.', httpStatus.OK);
        }

        return sendResponse(
            {
                booksHistory,
                totalHistory,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            `${booksHistory.length} books history records fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get book history: ${error}`);

        return errorResponse(
            error.message || 'Failed to get book history.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * getBookHistory - Retrieves the history of a specific book based on the provided book ID.
 * Fetches the history of the specified book and returns the details.
 *
 * @async
 * @function
 * @param {ObjectId} bookId - The ID of the book to retrieve the history for.
 * @returns {Promise<Object>} The response object containing the book history records and a status message.
 */
const getBookHistory = async (bookId) => {
    try {
        const bookHistory = await BooksHistoryModel.findOne({ book: bookId });
        if (!bookHistory) {
            return errorResponse(
                'No books history found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            bookHistory,
            'Successfully retrieved book history.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get book history: ${error}`);

        return errorResponse(
            error.message || 'Failed to get book history.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * booksHistoryService - An object that holds service functions for books history-related operations.
 * These functions handle the retrieval of books history and ensure the data meets the required criteria.
 *
 * @typedef {Object} BooksHistoryService
 * @property {Function} getBooksHistory - Retrieves the history of books based on provided query parameters.
 * @property {Function} getBookHistory - Retrieves the history of a specific book based on the provided book ID.
 */
const writersService = {
    getBooksHistory,
    getBookHistory,
};

export default writersService;
