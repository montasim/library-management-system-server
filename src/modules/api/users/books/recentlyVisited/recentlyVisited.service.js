/**
 * @fileoverview
 * This module defines the service for handling operations related to recently visited books.
 * It includes functions for adding a book to the recently visited list and retrieving the list of recently visited books.
 * The service interacts with the `RecentlyVisitedBooksModel` and `BooksModel` to perform database operations.
 */

import httpStatus from '../../../../../constant/httpStatus.constants.js';
import RecentlyVisitedBooksModel from './recentlyVisited.model.js';
import BooksModel from '../../../books/books.model.js';
import loggerService from '../../../../../service/logger.service.js';

import errorResponse from '../../../../../utilities/errorResponse.js';
import sendResponse from '../../../../../utilities/sendResponse.js';

/**
 * Adds a book to the recently visited books list for the requester.
 *
 * This function validates the provided book ID, checks if the book is already in the recently visited list,
 * populates the book details, and saves the updated list to the database.
 * It ensures that the list does not exceed 10 books by removing the oldest book if necessary.
 *
 * @function
 * @async
 * @name recentlyVisitedService.add
 *
 * @param {Object} requester - The user making the request, identified by their ID.
 * @param {Object} bookData - The data of the book to be added, containing the book ID.
 *
 * @returns {Promise<Object>} - A promise that resolves to the result of the addition operation:
 * - On success: An object containing the added book details and the updated recently visited books list.
 * - On failure: An error response with the appropriate HTTP status code and message.
 *
 * @throws {Error} - Throws an error if there is an issue adding the book to the recently visited list.
 */
const add = async (requester, bookData) => {
    try {
        const bookId = bookData.book;
        const isValidBook = await BooksModel.exists({ _id: bookId });
        if (!isValidBook) {
            return errorResponse(
                'Please provide a valid book.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Fetch or initialize the recently visited books document
        let recentlyVisitedBooks = await RecentlyVisitedBooksModel.findOne({
            user: requester,
        });
        if (!recentlyVisitedBooks) {
            recentlyVisitedBooks = new RecentlyVisitedBooksModel({
                user: requester,
                books: [],
            });
        }

        // Check if the book is already in the recently visited list
        const existingBook = recentlyVisitedBooks.books.find(
            (book) => book.id.toString() === bookId.toString()
        );
        if (existingBook) {
            return errorResponse(
                'The book is already in your recently visited list.',
                httpStatus.BAD_REQUEST
            );
        }

        // Populate book details (writer, publication, subject)
        const book = await BooksModel.findById(bookId)
            .populate({ path: 'writer', select: '-createdBy -updatedBy' })
            .populate({ path: 'publication', select: '-createdBy -updatedBy' })
            .populate({ path: 'subject', select: '-createdBy -updatedBy' })
            .select('-createdBy -updatedBy');

        if (!book) {
            return errorResponse('Book not found.', httpStatus.NOT_FOUND);
        }

        // Add new book to the end of the array
        if (recentlyVisitedBooks.books.length >= 10) {
            // Remove the first book to make space
            recentlyVisitedBooks.books.shift();
        }
        recentlyVisitedBooks.books.push({ id: bookId });

        await recentlyVisitedBooks.save();

        return sendResponse(
            { book, recentlyVisitedBooks },
            'Successfully saved recently visited book.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to save recently visited book: ${error}`);

        return errorResponse(
            error.message || 'Failed to save recently visited book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves the list of recently visited books for the requester.
 *
 * This function fetches the recently visited books for the authenticated user, populates the book details,
 * and returns the list of books.
 *
 * @function
 * @async
 * @name recentlyVisitedService.get
 *
 * @param {Object} requester - The user making the request, identified by their ID.
 *
 * @returns {Promise<Object>} - A promise that resolves to the result of the retrieval operation:
 * - On success: An array of populated book details.
 * - On failure: An error response with the appropriate HTTP status code and message.
 *
 * @throws {Error} - Throws an error if there is an issue retrieving the recently visited books.
 */
const get = async (requester) => {
    try {
        // Fetch recently visited books for the user
        const recentlyVisitedBooks = await RecentlyVisitedBooksModel.findOne({
            user: requester,
        })
            .populate({
                path: 'books.id',
                select: '-createdBy -updatedBy',
                populate: [
                    { path: 'writer', select: 'name' },
                    { path: 'publication', select: 'name' },
                    { path: 'subject', select: 'name' },
                ],
            })
            .select('books')
            .lean();

        if (!recentlyVisitedBooks) {
            return sendResponse(
                {},
                'No recently visited books found.',
                httpStatus.OK
            );
        }

        // Extract populated books array from the document
        const populatedBooks = recentlyVisitedBooks.books.map(
            (book) => book.id
        );

        return sendResponse(
            {
                total: populatedBooks?.length,
                books: populatedBooks,
            },
            'Successfully retrieved recently visited books.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get recently visited book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get recently visited book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const recentlyVisitedService = {
    add,
    get,
};

export default recentlyVisitedService;
