/**
 * @fileoverview This file defines and exports the service functions for handling book returns.
 * The main function, returnBook, is responsible for validating the book return, updating the lending records,
 * and maintaining the book's history. It ensures that the book return process is handled correctly and logs
 * any errors encountered during the process.
 */

import httpStatus from '../../../../constant/httpStatus.constants.js';
import LendBooksModel from '../lend/lendBooks.model.js';
import BooksHistoryModel from '../history/booksHistory.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import loggerService from '../../../../service/logger.service.js';

/**
 * returnBook - Service function to handle the return of a book by a user.
 * It validates if the book is currently lent by the user, updates the lending records, and maintains the book's history.
 *
 * @async
 * @function
 * @param {Object} requester - The user who is requesting the book return.
 * @param {Object} bookData - The data related to the book being returned, including user ID, book ID, and remarks.
 * @returns {Promise<Object>} - Returns a response object indicating success or failure.
 *
 * @example
 * const response = await returnBook(requester, bookData);
 * console.log(response);
 */
const returnBook = async (requester, bookData) => {
    try {
        // Step 2: Validate if the book is currently lent by the user
        const lendRecord = await LendBooksModel.findOne({
            lender: bookData.user,
            'books.id': bookData.bookId,
        });
        if (!lendRecord) {
            return errorResponse(
                'No lending record found for this book by the specified user.',
                httpStatus.NOT_FOUND
            );
        }

        // Find the lend details for the specific book
        const lendDetails = lendRecord.books.find(
            (book) => book.id.toString() === bookData.bookId
        );
        if (!lendDetails) {
            return errorResponse(
                'No lending record details found for this book by the specified user.',
                httpStatus.NOT_FOUND
            );
        }

        // Step 3: Remove the book from the lender's list
        lendRecord.books = lendRecord.books.filter(
            (book) => book.id.toString() !== bookData.bookId
        );

        await lendRecord.save();

        // Step 4: Update the books history with the lend and return details
        let bookHistory = await BooksHistoryModel.findOne({
            book: bookData.bookId,
        });
        if (!bookHistory) {
            bookHistory = new BooksHistoryModel({
                book: bookData.bookId,
                lend: [],
                return: [],
            });
        }

        // Add to lend history if not already present
        if (
            !bookHistory.lend.some(
                (lend) => lend.user.toString() === bookData.user
            )
        ) {
            bookHistory.lend.push({
                user: bookData.user,
                from: lendDetails.from,
                to: lendDetails.to,
                remarks: lendDetails.remarks || '',
            });
        }

        // Add to return history
        bookHistory.return.push({
            user: bookData.user,
            date: new Date(),
            remarks: bookData.remarks || '',
        });

        await bookHistory.save();

        return sendResponse({}, 'Book returned successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to return book: ${error}`);

        return errorResponse(
            error.message || 'Failed to return book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * writersService - An object that holds the service functions for book return operations.
 *
 * @typedef {Object} WritersService
 * @property {Function} returnBook - Service function to handle the return of a book by a user.
 */
const writersService = {
    returnBook,
};

export default writersService;
