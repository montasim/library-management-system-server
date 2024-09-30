/**
 * @fileoverview This file defines the service functions for managing trending publications. These services include
 * functions for retrieving the most popular publications based on user favourites. The services interact with the
 * FavouritePublications model and utilize various utilities for logging, response handling, and error handling.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import loggerService from '../../../../service/logger.service.js';
import FavouriteBooksModel from '../../books/favourite/favouriteBooks.model.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

/**
 * getTrendingPublications - Service function to retrieve a list of trending publications. This function aggregates
 * data from the FavouritePublications model to find the most popular publications across all users' favourites. It
 * returns the top trending publications based on a specified threshold and limit.
 *
 * @returns {Promise<Object>} - The retrieved list of trending publications or an error response.
 *
 * @example
 * const trendingPublications = await trendingPublicationsService.getTrendingPublications();
 * console.log(trendingPublications);
 */
const getTrendingPublications = async () => {
    try {
        // Aggregate to find the most common publications across all users' favourite books
        const trendingPublications = await FavouriteBooksModel.aggregate([
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
                    _id: '$bookDetails.publication', // Group by publication ID
                    count: { $sum: 1 }, // Count the occurrences of each publication
                },
            },
            {
                $match: {
                    count: { $gt: 2 }, // A publication is trending if books are favorited by more than 2 users
                },
            },
            {
                $lookup: {
                    from: 'publications', // Join with the publications collection
                    localField: '_id', // The _id here is the publication ID from the group stage
                    foreignField: '_id', // Match with the _id field in the publications collection
                    as: 'publicationDetails', // Store the joined publication details in publicationDetails
                },
            },
            {
                $unwind: '$publicationDetails', // Unwind the publicationDetails array
            },
            {
                $project: {
                    publicationDetails: 1, // Include publication details in the result
                    count: 1, // Include the count of how many times the publication's books have been favorited
                },
            },
            {
                $sort: { count: -1 }, // Sort by the count of favorited publications in descending order
            },
            {
                $limit: 10, // Limit to the top 10 trending publications
            },
        ]);

        const totalItems = trendingPublications.length;

        if (totalItems === 0) {
            return sendResponse(
                {
                    items: [],
                    totalItems,
                },
                'No trending publications found at the moment.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                items: trendingPublications.map(publication => ({
                    ...publication.publicationDetails,
                    count: publication.count, // Add favorite count to each publication detail
                })),
                totalItems,
            },
            `${totalItems} publication${totalItems === 1 ? '' : 's'} fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get trending publications: ${error}`);

        return errorResponse(
            error.message || 'Failed to get trending publications.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * trendingPublicationsService - Object containing the defined service function for trending publications management:
 *
 * - getTrendingPublications: Service function to retrieve a list of trending publications.
 */
const trendingPublicationsService = {
    getTrendingPublications,
};

export default trendingPublicationsService;
