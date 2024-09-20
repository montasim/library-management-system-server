/**
 * @fileoverview This file defines the service functions for handling user book history operations.
 * The services include methods to retrieve the book history for a user and to fetch the history of a specific book for a user.
 * These functions interact with the `BooksHistoryModel` and handle data population, error responses, and logging.
 */

import mongoose from 'mongoose';

import httpStatus from '../../../../constant/httpStatus.constants.js';
import BooksHistoryModel from '../../books/history/booksHistory.model.js';
import loggerService from '../../../../service/logger.service.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

/**
 * Retrieves the book history for the requesting user.
 *
 * This function fetches all lending and returning records associated with the requester from the `BooksHistoryModel`.
 * It populates the book details and the users involved in the transactions, and sends a response with the history.
 * If no history is found, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name getBooksHistory
 * @param {string} requester - The ID of the user requesting the book history.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the book history or an error message.
 */
const getBooksHistory = async (requester) => {
    try {
        // Aggregation pipeline to fetch and format data
        const bookHistories = await BooksHistoryModel.aggregate([
            {
                // Match documents where the requester is in either lend or return
                $match: {
                    $or: [
                        { 'lend.user': new mongoose.Types.ObjectId(requester) },
                        { 'return.user': new mongoose.Types.ObjectId(requester) },
                    ],
                },
            },
            {
                // Lookup to populate the book details
                $lookup: {
                    from: 'books',
                    localField: 'book',
                    foreignField: '_id',
                    as: 'book',
                },
            },
            {
                // Unwind to deconstruct the book array
                $unwind: {
                    path: '$book',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Lookup to populate writer details of the book
                $lookup: {
                    from: 'writers',
                    localField: 'book.writer',
                    foreignField: '_id',
                    as: 'book.writer',
                },
            },
            {
                // Unwind writer details to extract the first object from the array
                $unwind: {
                    path: '$book.writer',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Lookup to populate subject details of the book
                $lookup: {
                    from: 'subjects',
                    localField: 'book.subject',
                    foreignField: '_id',
                    as: 'book.subject',
                },
            },
            // No unwind for subjects to handle multiple subjects properly
            {
                // Lookup to populate publication details of the book
                $lookup: {
                    from: 'publications',
                    localField: 'book.publication',
                    foreignField: '_id',
                    as: 'book.publication',
                },
            },
            {
                // Unwind publication details to extract the first object from the array
                $unwind: {
                    path: '$book.publication',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                // Reshape the final document format to include only necessary fields
                $project: {
                    _id: 0,
                    user: { id: requester },
                    book: {
                        _id: '$book._id',
                        name: '$book.name',
                        image: '$book.image',
                        summary: '$book.summary',
                        page: '$book.page',
                        edition: '$book.edition',
                        price: '$book.price',
                        isActive: '$book.isActive',
                        writer: {
                            _id: '$book.writer._id',
                            name: '$book.writer.name',
                        },
                        subject: {
                            $map: {
                                input: '$book.subject',
                                as: 'subj',
                                in: {
                                    _id: '$$subj._id',
                                    name: '$$subj.name',
                                },
                            },
                        },
                        publication: {
                            _id: '$book.publication._id',
                            name: '$book.publication.name',
                        },
                    },
                    lend: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: '$lend',
                                    as: 'lend',
                                    cond: { $eq: ['$$lend.user', new mongoose.Types.ObjectId(requester)] },
                                },
                            },
                            0,
                        ],
                    },
                    return: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: '$return',
                                    as: 'return',
                                    cond: { $eq: ['$$return.user', new mongoose.Types.ObjectId(requester)] },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
        ]);

        if (!bookHistories.length) {
            return sendResponse(
                {},
                'No book history found for this user.',
                httpStatus.OK
            );
        }

        // Reshape the data into the required format
        const formattedData = {
            user: { id: requester },
            books: bookHistories.map((history) => ({
                book: history.book,
                lend: history.lend
                    ? { from: history.lend.from, to: history.lend.to, remarks: history.lend.remarks }
                    : null,
                return: history.return
                    ? { date: history.return.date, remarks: history.return.remarks }
                    : null,
            })),
        };

        return sendResponse(
            formattedData,
            'Successfully retrieved book history.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get books history: ${error}`);

        return errorResponse(
            error.message || 'Failed to get books history.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves the lending and return history of a specific book identified by its ID, limited to the transactions involving the requester.
 *
 * This function fetches the book's history with specific conditions on the user involved in the transactions from the `BooksHistoryModel`.
 * It populates the book details and the users involved in the transactions, ensuring the requester is part of the history.
 * If no relevant history is found, it returns an appropriate error response.
 *
 * @async
 * @function
 * @name getBookHistoryByBookId
 * @param {string} requester - The ID of the user requesting the history.
 * @param {string} bookId - The ID of the book for which history is being requested.
 * @returns {Promise<Object>} - A promise that resolves to the response object detailing the book's history relevant to the requester or an error message.
 */
const getBookHistoryByBookId = async (requester, bookId) => {
    try {
        // Fetch the book's history with specific conditions on the user involved in the transactions
        const bookHistory = await BooksHistoryModel.findOne({
            book: bookId,
            $or: [{ 'lend.user': requester }, { 'return.user': requester }],
        })
            .populate({
                path: 'book',
                select: '-createdBy -updatedBy',
            })
            .populate({
                path: 'lend.user return.user',
                select: '-createdBy -updatedBy',
                match: { _id: requester },
            })
            .populate({
                path: 'lend return',
                populate: {
                    path: 'user',
                    select: '-createdBy -updatedBy',
                    match: { _id: requester },
                },
            });

        if (
            !bookHistory ||
            (!bookHistory.lend.length && !bookHistory.return.length)
        ) {
            return errorResponse(
                'No relevant book history found for this book.',
                httpStatus.NOT_FOUND
            );
        }

        // Send a successful response with the populated book history
        return sendResponse(
            bookHistory,
            'Successfully retrieved your book history.',
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

const userBookHistoryService = {
    getBooksHistory,
    getBookHistoryByBookId,
};

export default userBookHistoryService;
