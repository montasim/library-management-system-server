/**
 * @fileoverview This file defines the service functions for handling operations related to user-lent books.
 * The services include methods to retrieve the list of lent books for a user, fetch details of a specific
 * lent book. These functions interact with the `LentBooksModel`
 * and handle data retrieval, manipulation, error responses, and logging.
 */

import mongoose from 'mongoose';

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
        // Aggregation pipeline to fetch lent books with detailed populated book information
        const lentBooks = await LentBooksModel.aggregate([
            {
                // Match the documents where the requester is the lender
                $match: {
                    lender: new mongoose.Types.ObjectId(requester),
                },
            },
            {
                // Unwind the books array to process each book individually
                $unwind: {
                    path: '$books',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Lookup to populate detailed book information
                $lookup: {
                    from: 'books', // Collection name for Books
                    localField: 'books.id',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            {
                // Unwind to get the book details as an object
                $unwind: {
                    path: '$bookDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Lookup to populate writer details of the book
                $lookup: {
                    from: 'writers',
                    localField: 'bookDetails.writer',
                    foreignField: '_id',
                    as: 'bookDetails.writer',
                },
            },
            {
                // Unwind writer details to extract the first object from the array
                $unwind: {
                    path: '$bookDetails.writer',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Lookup to populate subject details of the book
                $lookup: {
                    from: 'subjects',
                    localField: 'bookDetails.subject',
                    foreignField: '_id',
                    as: 'bookDetails.subject',
                },
            },
            {
                // Lookup to populate publication details of the book
                $lookup: {
                    from: 'publications',
                    localField: 'bookDetails.publication',
                    foreignField: '_id',
                    as: 'bookDetails.publication',
                },
            },
            {
                // Unwind publication details to extract the first object from the array
                $unwind: {
                    path: '$bookDetails.publication',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Reshape the document to include only necessary fields and format nested details
                $project: {
                    _id: 0,
                    book: {
                        _id: '$bookDetails._id',
                        name: '$bookDetails.name',
                        image: '$bookDetails.image',
                        summary: '$bookDetails.summary',
                        page: '$bookDetails.page',
                        edition: '$bookDetails.edition',
                        price: '$bookDetails.price',
                        isActive: '$bookDetails.isActive',
                        writer: {
                            _id: '$bookDetails.writer._id',
                            name: '$bookDetails.writer.name',
                        },
                        subject: {
                            $map: {
                                input: '$bookDetails.subject',
                                as: 'subj',
                                in: {
                                    _id: '$$subj._id',
                                    name: '$$subj.name',
                                },
                            },
                        },
                        publication: {
                            _id: '$bookDetails.publication._id',
                            name: '$bookDetails.publication.name',
                        },
                    },
                    from: '$books.from',
                    to: '$books.to',
                    remarks: '$books.remarks',
                },
            },
            {
                // Group results back into an array to match the desired output format
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    lentBooks: { $push: '$$ROOT' },
                },
            },
            {
                // Reshape the final output format
                $project: {
                    _id: 0,
                    total: 1,
                    lentBooks: 1,
                },
            },
        ]);

        if (!lentBooks.length) {
            return sendResponse(
                {},
                'You have not lent any book yet.',
                httpStatus.OK
            );
        }

        return sendResponse(
            lentBooks[0],
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
 * @param {string} lentBookId - The ID of the lent book.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the book details or an error message.
 */
const getLentBook = async (requester, lentBookId) => {
    try {
        // Retrieve the whole document of requests from the specific user
        const lentBooks = await LentBooksModel.findOne({
            owner: requester,
        });
        if (!lentBooks) {
            return errorResponse(
                'No book requests found for this user.',
                httpStatus.NOT_FOUND
            );
        }

        // Find the specific book request in the array of request
        const bookLent = lentBooks.lentBooks.find((book) => {
            return book._id.toString() === lentBookId;
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
