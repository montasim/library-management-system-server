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
                $unwind: '$favouriteBooks', // Unwind the favouriteBooks array for each user
            },
            {
                $group: {
                    _id: '$favouriteBooks', // Group by the book ID
                    count: { $sum: 1 }, // Count the occurrences of each book
                },
            },
            {
                $match: {
                    count: { $gt: 1 }, // A book is trending if favorited by more than 2 users
                },
            },
            {
                $lookup: {
                    from: 'books', // Join with the books collection
                    localField: '_id', // The _id here is the book ID from the favouriteBooks array
                    foreignField: '_id', // Match with the _id field in the books collection
                    as: 'bookDetails', // Store the joined book details in bookDetails
                },
            },
            {
                $unwind: '$bookDetails', // Unwind the bookDetails array
            },
            {
                $project: {
                    bookDetails: 1, // Include book details in the result
                    count: 1, // Include the count of how many times the book has been favorited
                },
            },
            {
                $sort: { count: -1 }, // Sort by the count of favorited books in descending order
            },
            {
                $limit: 10, // Limit to the top 10 trending books
            },
        ]);

        const totalItems = trendingBooks.length;

        if (totalItems === 0) {
            return sendResponse(
                {
                    items: [],
                    totalItems,
                },
                'No trending books found at the moment.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                items: trendingBooks.map((book) => ({
                    ...book.bookDetails,
                    count: book.count, // Add favorite count to each book detail
                })),
                totalItems,
            },
            `${totalItems} book${totalItems === 1 ? '' : 's'} fetched successfully.`,
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
