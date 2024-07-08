import httpStatus from '../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import BooksHistoryModel from './booksHistory.model.js';

const getBooksHistory = async (requester) => {
    try {
        // Step 1: Validate if the requester is authorized
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to get lend books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        const booksHistory = await BooksHistoryModel.find();

        if (!booksHistory) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'No books history found.',
                status: httpStatus.NOT_FOUND,
            };
        }

        return {
            timeStamp: new Date(),
            success: true,
            data: booksHistory,
            message: `Successfully retrieved ${booksHistory.length} books history.`,
            status: httpStatus.OK,
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Failed to retrieve lend books.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getBookHistory = async (requester, bookId) => {
    try {
        // Step 1: Validate if the requester is authorized
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to get lend books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        const bookHistory = await BooksHistoryModel.findOne({ book: bookId });

        if (!bookHistory) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'No books history found.',
                status: httpStatus.NOT_FOUND,
            };
        }

        return {
            timeStamp: new Date(),
            success: true,
            data: bookHistory,
            message: 'Successfully retrieved book history.',
            status: httpStatus.OK,
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Failed to retrieve lend books.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const writersService = {
    getBooksHistory,
    getBookHistory,
};

export default writersService;
