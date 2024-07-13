import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import BooksHistoryModel from '../../books/history/booksHistory.model.js';
import sendResponse from '../../../../utilities/sendResponse.js';

const getBooksHistory = async (requester) => {
    // Validate user permission
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'Please login to access book history.',
            httpStatus.UNAUTHORIZED
        );
    }

    // Fetch all lending and returning records associated with the requester
    const bookHistories = await BooksHistoryModel.find({
        $or: [
            { 'lend.user': requester },
            { 'return.user': requester }
        ]
    }).populate({
        path: 'book',
        select: '-createdBy -updatedBy'
    }).populate({
        path: 'lend.user return.user',
        select: '-createdBy -updatedBy'
    });

    if (!bookHistories.length) {
        return errorResponse('No book history found for this user.', httpStatus.NOT_FOUND);
    }

    return sendResponse(
        bookHistories,
        'Successfully retrieved book history.',
        httpStatus.OK
    );
};

/**
 * Retrieves the lending and return history of a specific book identified by its ID, limited to the transactions involving the requester.
 *
 * @param {string} requester - The ID of the user requesting the history.
 * @param {string} bookId - The ID of the book for which history is being requested.
 * @returns {Promise<Object>} - A promise that resolves to the response object detailing the book's history relevant to the requester.
 */
const getBookHistoryByBookId = async (requester, bookId) => {
    // Validate user permission
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'Please login to access book history.',
            httpStatus.UNAUTHORIZED
        );
    }

    // Fetch the book's history with specific conditions on the user involved in the transactions
    const bookHistory = await BooksHistoryModel.findOne({
        book: bookId,
        $or: [
            { 'lend.user': requester },
            { 'return.user': requester }
        ]
    })
        .populate({
            path: 'book',
            select: '-createdBy -updatedBy'
        })
        .populate({
            path: 'lend.user return.user',
            select: '-createdBy -updatedBy',
            match: { _id: requester }
        })
        .populate({
            path: 'lend return',
            populate: {
                path: 'user',
                select: '-createdBy -updatedBy',
                match: { _id: requester }
            }
        });

    if (!bookHistory || !bookHistory.lend.length && !bookHistory.return.length) {
        return errorResponse('No relevant book history found for this book.', httpStatus.NOT_FOUND);
    }

    // Send a successful response with the populated book history
    return sendResponse(
        bookHistory,
        'Successfully retrieved your book history.',
        httpStatus.OK
    );
};

const userBookHistoryService = {
    getBooksHistory,
    getBookHistoryByBookId,
};

export default userBookHistoryService;
