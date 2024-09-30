/**
 * @fileoverview This file defines the service functions for managing trending writers. These services include
 * functions for retrieving the most popular writers based on user favourites. The services interact with the
 * FavouriteWriters model and utilize various utilities for logging, response handling, and error handling.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import loggerService from '../../../../service/logger.service.js';
import FavouriteBooksModel from '../../books/favourite/favouriteBooks.model.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

/**
 * getTrendingWriters - Service function to retrieve a list of trending writers. This function aggregates
 * data from the FavouriteWriters model to find the most popular writers across all users' favourites. It
 * returns the top trending writers based on a specified threshold and limit.
 *
 * @returns {Promise<Object>} - The retrieved list of trending writers or an error response.
 *
 * @example
 * const trendingWriters = await trendingWritersService.getTrendingWriters();
 * console.log(trendingWriters);
 */
const getTrendingWriters = async () => {
    try {
        // Aggregate to find the most common writers across all users' favourite books
        const trendingWriters = await FavouriteBooksModel.aggregate([
            {
                $unwind: '$favouriteBooks', // Unwind the favouriteBooks array for each user
            },
            {
                $lookup: {
                    from: 'books', // Join with the books collection to get book details
                    localField: 'favouriteBooks', // The favouriteBooks field contains book IDs
                    foreignField: '_id', // Match with the _id field in the books collection
                    as: 'bookDetails', // Store the joined book details in bookDetails
                },
            },
            {
                $unwind: '$bookDetails', // Unwind the bookDetails array
            },
            {
                $group: {
                    _id: '$bookDetails.writer', // Group by writer ID
                    count: { $sum: 1 }, // Count the occurrences of each writer
                },
            },
            {
                $match: {
                    count: { $gt: 2 }, // A writer is trending if favorited by more than 2 users
                },
            },
            {
                $lookup: {
                    from: 'writers', // Join with the writers collection
                    localField: '_id', // The _id here is the writer ID from the group stage
                    foreignField: '_id', // Match with the _id field in the writers collection
                    as: 'writerDetails', // Store the joined writer details in writerDetails
                },
            },
            {
                $unwind: '$writerDetails', // Unwind the writerDetails array
            },
            {
                $project: {
                    writerDetails: 1, // Include writer details in the result
                    count: 1, // Include the count of how many times the writer has been favorited
                },
            },
            {
                $sort: { count: -1 }, // Sort by the count of favorited writers in descending order
            },
            {
                $limit: 10, // Limit to the top 10 trending writers
            },
        ]);

        const totalItems = trendingWriters.length;

        if (totalItems === 0) {
            return sendResponse(
                {
                    items: [],
                    totalItems,
                },
                'No trending writers found at the moment.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                items: trendingWriters.map(writer => ({
                    ...writer.writerDetails,
                    count: writer.count, // Add favorite count to each writer detail
                })),
                totalItems,
            },
            `${totalItems} writer${totalItems === 1 ? '' : 's'} fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get trending writers: ${error}`);

        return errorResponse(
            error.message || 'Failed to get trending writers.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * trendingWritersService - Object containing the defined service function for trending writers management:
 *
 * - getTrendingWriters: Service function to retrieve a list of trending writers.
 */
const trendingWritersService = {
    getTrendingWriters,
};

export default trendingWritersService;
