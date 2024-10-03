/**
 * @fileoverview This file defines the service functions for managing trending subjects. These services include
 * functions for retrieving the most popular subjects based on user favourites. The services interact with the
 * FavouriteSubjects model and utilize various utilities for logging, response handling, and error handling.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import loggerService from '../../../../service/logger.service.js';
import FavouriteBooksModel from '../../books/favourite/favouriteBooks.model.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

/**
 * getTrendingSubjects - Service function to retrieve a list of trending subjects. This function aggregates
 * data from the FavouriteSubjects model to find the most popular subjects across all users' favourites. It
 * returns the top trending subjects based on a specified threshold and limit.
 *
 * @returns {Promise<Object>} - The retrieved list of trending subjects or an error response.
 *
 * @example
 * const trendingSubjects = await trendingSubjectsService.getTrendingSubjects();
 * console.log(trendingSubjects);
 */
const getTrendingSubjects = async () => {
    try {
        // Aggregate to find the most common subjects across all users' favourite books
        const trendingSubjects = await FavouriteBooksModel.aggregate([
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
                    _id: '$bookDetails.subject', // Group by subject ID
                    count: { $sum: 1 }, // Count the occurrences of each subject
                },
            },
            {
                $match: {
                    count: { $gt: 2 }, // A subject is trending if books are favorited by more than 2 users
                },
            },
            {
                $lookup: {
                    from: 'subjects', // Join with the subjects collection
                    localField: '_id', // The _id here is the subject ID from the group stage
                    foreignField: '_id', // Match with the _id field in the subjects collection
                    as: 'subjectDetails', // Store the joined subject details in subjectDetails
                },
            },
            {
                $unwind: '$subjectDetails', // Unwind the subjectDetails array
            },
            {
                $project: {
                    subjectDetails: 1, // Include subject details in the result
                    count: 1, // Include the count of how many times the subject's books have been favorited
                },
            },
            {
                $sort: { count: -1 }, // Sort by the count of favorited subjects in descending order
            },
            {
                $limit: 10, // Limit to the top 10 trending subjects
            },
        ]);

        const totalItems = trendingSubjects.length;

        if (totalItems === 0) {
            return sendResponse(
                {
                    items: [],
                    totalItems,
                },
                'No trending subjects found at the moment.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                items: trendingSubjects.map((subject) => ({
                    ...subject.subjectDetails,
                    count: subject.count, // Add favorite count to each subject detail
                })),
                totalItems,
            },
            `${totalItems} subject${totalItems === 1 ? '' : 's'} fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get trending subjects: ${error}`);

        return errorResponse(
            error.message || 'Failed to get trending subjects.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * trendingSubjectsService - Object containing the defined service function for trending subjects management:
 *
 * - getTrendingSubjects: Service function to retrieve a list of trending subjects.
 */
const trendingSubjectsService = {
    getTrendingSubjects,
};

export default trendingSubjectsService;
