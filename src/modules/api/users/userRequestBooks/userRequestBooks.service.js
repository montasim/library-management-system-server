import httpStatus from '../../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import RequestBooksModel from '../../books/requestBooks/requestBooks.model.js';

const getRequestBooks = async (requester) => {
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
};

const getRequestBook = async (requester, requestBookId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You have not requested any book yet.',
                httpStatus.NOT_FOUND
            );
            return {
                timeStamp: new Date(),
                success: false,
                message: 'You are not authorized to access book requests.',
                status: httpStatus.FORBIDDEN,
            };
        }

        // Retrieve the whole document of requests from the specific user
        const requestBooks = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (!requestBooks) {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'No book requests found for this user.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Find the specific book requestBooks in the array of requestBooks
        const bookRequest = requestBooks.requestBooks.find((book) => {
            console.log(book._id.toString());

            return book._id.toString() === requestBookId;
        });
        if (!bookRequest) {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'Book requestBooks not found.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Return the found book requestBooks
        return {
            timeStamp: new Date(),
            success: true,
            data: bookRequest,
            message: 'Successfully retrieved the book requestBooks.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            message: error.message || 'Failed to retrieve the book requestBooks.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const deleteRequestBook = async (requester, requestBookId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'You are not authorized to delete book requests.',
                status: httpStatus.FORBIDDEN,
            };
        }

        const requestBook = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (!requestBook) {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'No book requestBooks found to delete.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Remove the requested book by ID from the array
        const index = requestBook.requestBooks.findIndex(
            (book) => book._id.toString() === requestBookId
        );
        if (index > -1) {
            requestBook.requestBooks.splice(index, 1);
            await requestBook.save();
            return {
                timeStamp: new Date(),
                success: true,
                data: { removedBookId: requestBookId },
                message: 'Book requestBooks removed successfully.',
                status: httpStatus.OK,
            };
        } else {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'Book requestBooks not found in your records.',
                status: httpStatus.NOT_FOUND,
            };
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            message: 'Failed to remove the book requestBooks.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const writersService = {
    getRequestBooks,
    getRequestBook,
    deleteRequestBook,
};

export default writersService;
