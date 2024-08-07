/**
 * @fileoverview This file defines and exports the service for handling desired books-related operations.
 * The service includes a function to retrieve the most desired books based on user requests,
 * utilizing MongoDB aggregation to group, count, and fetch details for the most requested books.
 * The service functions handle the business logic and communicate with the database models.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import RequestBooksModel from '../requestBooks/requestBooks.model.js';
import loggerService from '../../../../service/logger.service.js';

/**
 * getDesiredBooks - Service function to retrieve the most desired books based on user requests.
 * Aggregates user request data to find and return the top 10 most requested books along with their details.
 *
 * @returns {Promise<Object>} The response object containing the status, message, and data (list of desired books).
 * @throws {Error} If an error occurs during the aggregation or database query.
 */
const getDesiredBooks = async () => {
    try {
        // Aggregate to find the most desired books across all users' requests
        const desiredBooks = await RequestBooksModel.aggregate([
            {
                $unwind: '$requestBooks', // Unwind the array of requested books
            },
            {
                $group: {
                    _id: '$requestBooks.name', // Group by the name of the book
                    count: { $sum: 1 }, // Count how many times each book is requested
                },
            },
            {
                $match: {
                    count: { $gt: 1 }, // Filter to show books requested more than once
                },
            },
            {
                $lookup: {
                    from: 'books', // Assume a collection 'books' exists with book details
                    localField: '_id', // Book name in the requested books matches
                    foreignField: 'name', // Field in the books collection
                    as: 'bookDetails',
                },
            },
            {
                $unwind: '$bookDetails', // Flatten the bookDetails array
            },
            {
                $project: {
                    // Define which fields to include in the final output
                    bookDetails: 1, // Include details from the books collection
                    count: 1, // Include the count of requests
                },
            },
            {
                $sort: { count: -1 }, // Sort by the count in descending order
            },
            {
                $limit: 10, // Limit to the top 10 most requested books
            },
        ]);

        if (desiredBooks?.length === 0) {
            return errorResponse(
                'No desired books found at the moment.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            desiredBooks,
            `Successfully retrieved the top ${desiredBooks?.length} desired books.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error('Failed to get desired books:', error);

        return errorResponse(
            error.message || 'Failed to get desired books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * desiredBooksService - An object that holds the service functions for desired books-related operations.
 * Includes functions to retrieve the most desired books.
 *
 * @typedef {Object} DesiredBooksService
 * @property {Function} getDesiredBooks - Service function to retrieve the most desired books based on user requests.
 */
const desiredBooksService = {
    getDesiredBooks,
};

export default desiredBooksService;
