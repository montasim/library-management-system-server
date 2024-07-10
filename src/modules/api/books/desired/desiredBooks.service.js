import httpStatus from '../../../../constant/httpStatus.constants.js';
import RequestBooksModel from '../request/requestBooks.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

const getDesiredBooks = async () => {
    // Aggregate to find the most desired books across all users' requests
    const desiredBooks = await RequestBooksModel.aggregate([
        {
            $unwind: '$request', // Unwind the array of requested books
        },
        {
            $group: {
                _id: '$request.name', // Group by the name of the book
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
};

const desiredBooksService = {
    getDesiredBooks,
};

export default desiredBooksService;
