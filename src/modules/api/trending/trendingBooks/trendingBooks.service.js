/**
 * @fileoverview This file defines the service functions for managing trending books. These services include
 * functions for retrieving the most popular books based on user favourites. The services interact with the
 * FavouriteBooks model and utilize various utilities for logging, response handling, and error handling.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import FavouriteBooksModel from '../../books/favourite/favouriteBooks.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import loggerService from '../../../../service/logger.service.js';

/**
 * getTrendingBooks - Service function to retrieve a list of trending books. This function aggregates
 * data from the FavouriteBooks model to find the most popular books across all users' favourites. It
 * returns the top trending books based on a specified threshold and limit.
 *
 * @returns {Promise<Object>} - The retrieved list of trending books or an error response.
 *
 * @example
 * const trendingBooks = await trendingBooksService.getTrendingBooks();
 * console.log(trendingBooks);
 */
const getTrendingBooks = async () => {
    try {
        // Aggregate to find the most common books across all users' favourites
        const trendingBooks = await FavouriteBooksModel.aggregate([
            {
                $unwind: '$favourite',
            },
            {
                $group: {
                    _id: '$favourite',
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    count: { $gt: 1 }, // Adjust this threshold based on what you consider "trending"
                },
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            {
                $unwind: '$bookDetails',
            },
            {
                $project: {
                    bookDetails: 1,
                    count: 1,
                },
            },
            {
                $sort: { count: -1 }, // Sort by the most popular books first
            },
            {
                $limit: 10, // Limit to top 10 trending books
            },
        ]);

        if (trendingBooks.length === 0) {
            return sendResponse(
                {},
                'No trending books found at the moment.',
                httpStatus.OK
            );
        }

        return sendResponse(
            trendingBooks,
            `Successfully retrieved the top ${trendingBooks.length < 10 ? trendingBooks.length : '10'} trending books.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get trending books: ${error}`);

        return errorResponse(
            error.message || 'Failed to get trending books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * trendingBooksService - Object containing the defined service function for trending books management:
 *
 * - getTrendingBooks: Service function to retrieve a list of trending books.
 */
const trendingBooksService = {
    getTrendingBooks,
};

export default trendingBooksService;
