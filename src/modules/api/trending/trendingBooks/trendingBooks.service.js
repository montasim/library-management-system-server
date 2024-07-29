import httpStatus from '../../../../constant/httpStatus.constants.js';
import FavouriteBooksModel from '../../books/favourite/favouriteBooks.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import loggerService from '../../../../service/logger.service.js';

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
            return errorResponse(
                'No trending books found at the moment.',
                httpStatus.NOT_FOUND
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

const trendingBooksService = {
    getTrendingBooks,
};

export default trendingBooksService;
