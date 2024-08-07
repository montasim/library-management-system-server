/**
 * @fileoverview This file defines and exports the services related to lending books.
 * It includes functions for creating a lend book record and retrieving lend books for a requester.
 * These services interact with the database models to perform the necessary operations and return appropriate responses.
 */

import LendBooksModel from './lendBooks.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import BooksModel from '../books.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import UsersModel from '../../users/users.model.js';
import loggerService from '../../../../service/logger.service.js';

/**
 * createLendBook - Service function to create a new lend book record.
 * This function validates the input data, checks for existing lend records, and saves the new record to the database.
 *
 * @param {ObjectId} requester - The ID of the user making the request.
 * @param {Object} lendBookData - The data for the lend book record.
 * @returns {Promise<Object>} - The response object containing the status and data or error message.
 */
const createLendBook = async (requester, lendBookData) => {
    try {
        const lenderDetails = await UsersModel.findById(lendBookData.user);
        if (!lenderDetails) {
            return errorResponse(
                'No book found with the provided ID.',
                httpStatus.NOT_FOUND
            );
        }

        const bookDetails = await BooksModel.findById(lendBookData.bookId);
        if (!bookDetails) {
            return errorResponse(
                'No book found with the provided ID.',
                httpStatus.NOT_FOUND
            );
        }

        // Step 3: Check if the book is already lent by someone else
        const isBookLent = await LendBooksModel.findOne({
            'books.id': lendBookData.bookId,
        });
        if (isBookLent) {
            return errorResponse(
                'This book is already lent by someone else.',
                httpStatus.CONFLICT
            );
        }

        // Step 4: Validate the 'from' and 'to' dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to the start of the day

        const fromDate = new Date(lendBookData.from);
        const toDate = new Date(lendBookData.to);

        if (fromDate < today) {
            return errorResponse(
                'The "from" date cannot be earlier than today.',
                httpStatus.BAD_REQUEST
            );
        }

        const maxToDate = new Date(fromDate);
        maxToDate.setDate(fromDate.getDate() + 30); // Adding 30 days to 'from' date

        if (toDate > maxToDate) {
            return errorResponse(
                'The "to" date cannot be more than 30 days from the "from" date.',
                httpStatus.BAD_REQUEST
            );
        }

        // Step 5: Find existing document for the user or create a new one
        const existingLend = await LendBooksModel.findOne({
            lender: lendBookData.user,
        });
        if (existingLend) {
            // Prevent adding duplicate book IDs
            if (
                existingLend.books.some(
                    (book) => book.id.toString() === lendBookData.bookId
                )
            ) {
                return errorResponse(
                    'This book is already in your lend list.',
                    httpStatus.CONFLICT
                );
            }

            existingLend.books.push({
                id: lendBookData.bookId,
                from: lendBookData.from,
                to: lendBookData.to,
                remarks: lendBookData.remarks || '',
            });
            await existingLend.save();

            return sendResponse(
                existingLend,
                'You have lent the book successfully.',
                httpStatus.OK
            );
        } else {
            // Create a new document if none exists
            const newLendBook = await LendBooksModel.create({
                lender: lendBookData.user,
                books: [
                    {
                        id: lendBookData.bookId,
                        from: lendBookData.from,
                        to: lendBookData.to,
                        remarks: lendBookData.remarks || '',
                    },
                ],
            });

            return sendResponse(
                newLendBook,
                'Book added to your lend list.',
                httpStatus.CREATED
            );
        }
    } catch (error) {
        loggerService.error(`Failed to lend book: ${error}`);

        return errorResponse(
            error.message || 'Failed to lend book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * getLendBooks - Service function to retrieve lend books for a requester.
 * This function fetches the lend books data from the database and transforms the data for the response.
 *
 * @param {ObjectId} requester - The ID of the user making the request.
 * @returns {Promise<Object>} - The response object containing the status and data or error message.
 */
const getLendBooks = async (requester) => {
    try {
        // Step 2: Fetch the lend books for the requester
        const lendBooks = await LendBooksModel.findOne({
            lender: requester,
        }).populate({
            path: 'books.id',
            select: '-bestSeller -review -price -stockAvailable -createdBy -createdAt -updatedAt',
            populate: [
                {
                    path: 'subject',
                    model: 'Subjects',
                    select: 'name -_id',
                },
                {
                    path: 'publication',
                    model: 'Publications',
                    select: 'name -_id',
                },
            ],
        });

        // Step 3: Check if the requester has any lend books
        if (!lendBooks || lendBooks.books.length === 0) {
            return errorResponse(
                'You have no lend books.',
                httpStatus.NOT_FOUND
            );
        }

        // Step 4: Transform the data to rename 'id' to 'book'
        const transformedLendBooks = lendBooks.books.map((bookEntry) => ({
            ...bookEntry._doc,
            book: bookEntry.id,
            id: bookEntry._id,
        }));

        // Step 5: Return the lend books with the transformed structure
        return sendResponse(
            {
                total: transformedLendBooks.length,
                lendBooks: transformedLendBooks,
            },
            'Successfully retrieved your lend books.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get lend book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get lend book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * writersService - An object that holds the services for lending books.
 * These services include creating a lend book record and retrieving lend books for a requester.
 *
 * @typedef {Object} WritersService
 * @property {Function} createLendBook - Service function to create a new lend book record.
 * @property {Function} getLendBooks - Service function to retrieve lend books for a requester.
 */
const writersService = {
    createLendBook,
    getLendBooks,
};

export default writersService;
