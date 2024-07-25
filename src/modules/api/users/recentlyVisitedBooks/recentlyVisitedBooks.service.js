import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import logger from '../../../../utilities/logger.js';
import RecentlyVisitedBooksModel from './recentlyVisitedBooks.model.js';
import BooksModel from '../../books/books.model.js';

const add = async (requester, bookId) => {
    try {
        // Validate user permission
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'Please login to save recently visited book.',
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
        logger.error(`Failed to save recently visited book: ${error}`);

        return errorResponse(
            error.message || 'Failed to save recently visited book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const get = async (requester) => {
    try {
        // Validate user permission
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'Please login to access recently visited book.',
                httpStatus.UNAUTHORIZED
            );
        }

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
            return errorResponse(
                'No recently visited books found.',
                httpStatus.NOT_FOUND
            );
        }

        // Extract populated books array from the document
        const populatedBooks = recentlyVisitedBooks.books.map(
            (book) => book.id
        );

        return sendResponse(
            populatedBooks,
            'Successfully retrieved recently visited books.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to get recently visited book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get recently visited book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const recentlyVisitedBooksService = {
    add,
    get,
};

export default recentlyVisitedBooksService;
