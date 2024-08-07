/**
 * @fileoverview This file defines and exports the service functions for handling favourite books-related operations.
 * The services include functions for creating a favourite book, retrieving favourite books, and deleting a favourite book.
 * Each function interacts with the respective Mongoose models and returns a structured response.
 */

import FavouriteBooksModel from './favouriteBooks.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import BooksModel from '../books.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import loggerService from '../../../../service/logger.service.js';

/**
 * createFavouriteBook - Service function to add a book to the user's favourites.
 * Validates the book ID, checks for duplicates, and either updates the existing document or creates a new one.
 *
 * @param {ObjectId} requester - The ID of the user making the request.
 * @param {ObjectId} favouriteBookId - The ID of the book to be added to favourites.
 * @returns {Object} Response object indicating success or failure.
 */
const createFavouriteBook = async (requester, favouriteBookId) => {
    try {
        // Assuming BooksModel contains the book details
        const bookDetails = await BooksModel.findById(favouriteBookId);
        if (!bookDetails) {
            return errorResponse(
                'No book found with the provided ID.',
                httpStatus.NOT_FOUND
            );
        }

        // Find existing document for the user
        const existingFavourite = await FavouriteBooksModel.findOne({
            owner: requester,
        });
        if (existingFavourite) {
            // Prevent adding duplicate book IDs
            if (existingFavourite.favouriteBooks.includes(favouriteBookId)) {
                return errorResponse(
                    'This book is already in your favourites.',
                    httpStatus.CONFLICT
                );
            }

            existingFavourite.favouriteBooks.push(favouriteBookId);
            await existingFavourite.save();

            return sendResponse(
                existingFavourite,
                'Book added to your favourites successfully.',
                httpStatus.OK
            );
        }

        // Create a new document if none exists
        const newFavouriteBook = await FavouriteBooksModel.create({
            owner: requester,
            favouriteBooks: [favouriteBookId],
        });

        return sendResponse(
            newFavouriteBook,
            'Book added to your favourites.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create favourite book: ${error}`);

        return errorResponse(
            error.message || 'Failed to create favourite book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * getFavouriteBooks - Service function to retrieve the user's favourite books.
 * Retrieves the user's favourite books, populates related fields, and returns the list.
 *
 * @param {ObjectId} requester - The ID of the user making the request.
 * @returns {Object} Response object containing the list of favourite books.
 */
const getFavouriteBooks = async (requester) => {
    try {
        const favouriteBooks = await FavouriteBooksModel.findOne({
            owner: requester,
        }).populate({
            path: 'favouriteBooks',
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

        if (!favouriteBooks || favouriteBooks.favouriteBooks.length === 0) {
            return errorResponse(
                'You have no favourite books.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                total: favouriteBooks.favouriteBooks.length,
                favouriteBooks: favouriteBooks.favouriteBooks,
            },
            'Successfully retrieved your favourite books.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get favourite book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get favourite book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * deleteFavouriteBook - Service function to remove a book from the user's favourites.
 * Finds the user's favourite books, removes the specified book ID, and updates the document.
 *
 * @param {ObjectId} requester - The ID of the user making the request.
 * @param {ObjectId} favouriteBookId - The ID of the book to be removed from favourites.
 * @returns {Object} Response object indicating success or failure.
 */
const deleteFavouriteBook = async (requester, favouriteBookId) => {
    try {
        const favouriteBooks = await FavouriteBooksModel.findOne({
            owner: requester,
        });
        if (!favouriteBooks) {
            return errorResponse(
                'No favourite books found to remove.',
                httpStatus.NOT_FOUND
            );
        }

        const index = favouriteBooks.favouriteBooks.indexOf(favouriteBookId);
        if (index > -1) {
            favouriteBooks.favouriteBooks.splice(index, 1);
            await favouriteBooks.save();

            return sendResponse(
                { removedBookId: favouriteBookId },
                'Book removed from your favourites successfully.',
                httpStatus.OK
            );
        }

        return errorResponse(
            'Book not found in your favourites.',
            httpStatus.NOT_FOUND
        );
    } catch (error) {
        loggerService.error(`Failed to delete favourite book: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete favourite book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * favouriteBooksService - An object that holds the service functions for favourite books-related operations.
 * These services handle creating, retrieving, and deleting favourite books for authenticated users.
 *
 * @typedef {Object} FavouriteBooksService
 * @property {Function} createFavouriteBook - Service function to add a book to the user's favourites.
 * @property {Function} getFavouriteBooks - Service function to retrieve the user's favourite books.
 * @property {Function} deleteFavouriteBook - Service function to remove a book from the user's favourites.
 */
const writersService = {
    createFavouriteBook,
    getFavouriteBooks,
    deleteFavouriteBook,
};

export default writersService;
