import httpStatus from '../../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import RequestBooksModel from '../../books/requestBooks/requestBooks.model.js';
import logger from '../../../../utilities/logger.js';

const getRequestBooks = async (requester) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to get requestBooks book.',
                httpStatus.FORBIDDEN
            );
        }

        const requestBooks = await RequestBooksModel.findOne({
            owner: requester,
        });

        if (!requestBooks || requestBooks.requestBooks.length === 0) {
            return errorResponse(
                'You have not requested any book yet.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                total: requestBooks.requestBooks.length,
                requestBooks: requestBooks.requestBooks,
            },
            'Successfully retrieved your requested books.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to get requested books: ${error}`);

        return errorResponse(
            error.message || 'Failed to get requested books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getRequestBook = async (requester, requestBookId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to access requested books.',
                httpStatus.FORBIDDEN
            );
        }

        // Retrieve the whole document of requests from the specific user
        const requestBooks = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (!requestBooks) {
            return errorResponse(
                'No book requests found for this user.',
                httpStatus.NOT_FOUND
            );
        }

        // Find the specific book requestBooks in the array of requestBooks
        const bookRequest = requestBooks.requestBooks.find((book) => {
            console.log(book._id.toString());

            return book._id.toString() === requestBookId;
        });
        if (!bookRequest) {
            return errorResponse(
                'Book requestBooks not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Return the found book requestBooks
        return sendResponse(
            bookRequest,
            'Successfully retrieved the book requestBooks.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to get requested book: ${error}`);

        return errorResponse(
            error.message || 'Failed to get requested book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteRequestBook = async (requester, requestBookId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to delete book requests.',
                httpStatus.FORBIDDEN
            );
        }

        const requestBook = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (!requestBook) {
            return errorResponse(
                'No book requestBooks found to delete.',
                httpStatus.NOT_FOUND
            );
        }

        // Remove the requested book by ID from the array
        const index = requestBook.requestBooks.findIndex(
            (book) => book._id.toString() === requestBookId
        );
        if (index > -1) {
            requestBook.requestBooks.splice(index, 1);

            await requestBook.save();

            return sendResponse(
                {
                    removedBookId: requestBookId,
                },
                'Book requestBooks removed successfully.',
                httpStatus.OK
            );
        } else {
            return errorResponse(
                'Book requestBooks not found in your records.',
                httpStatus.NOT_FOUND
            );
        }
    } catch (error) {
        logger.error(`Failed to delete requested book: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete requested book.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const writersService = {
    getRequestBooks,
    getRequestBook,
    deleteRequestBook,
};

export default writersService;
