import RequestBooksModel from './requestBooks.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';

const createRequestBook = async (requester, bookData) => {
    try {
        // Validate if the user is authorized to make a request
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'You are not authorized to request books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        // Check for existing request document for the user
        const existingRequest = await RequestBooksModel.findOne({
            owner: requester,
        });
        if (existingRequest) {
            // Check for duplicate book request
            const isDuplicate = existingRequest.requestBooks.some(
                (book) => book.name === bookData.name
            );
            if (isDuplicate) {
                return {
                    timeStamp: new Date(),
                    success: false,
                    message: 'This book has already been requested.',
                    status: httpStatus.CONFLICT,
                };
            }

            // Add new book to the existing request document
            existingRequest.requestBooks.push(bookData);
            await existingRequest.save();

            return {
                timeStamp: new Date(),
                success: true,
                data: existingRequest,
                message: 'New book request added successfully.',
                status: httpStatus.OK,
            };
        } else {
            // Create a new request document if none exists
            const newRequest = await RequestBooksModel.create({
                owner: requester,
                requestBooks: [bookData],
            });

            return {
                timeStamp: new Date(),
                success: true,
                data: newRequest,
                message: 'Book request created successfully.',
                status: httpStatus.CREATED,
            };
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            message:
                error.message ||
                'Failed to process your request for a new book.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getRequestBooks = async (requester) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to get favourite books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        const requestBooks = await RequestBooksModel.findOne({
            owner: requester,
        }).populate({
            path: 'requestBooks',
            select: '',
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

        if (!requestBooks || requestBooks.requestBooks.length === 0) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You have no favourite books.',
                status: httpStatus.NOT_FOUND,
            };
        }

        return {
            timeStamp: new Date(),
            success: true,
            data: {
                total: requestBooks.requestBooks.length,
                requestBooks: requestBooks.requestBooks,
            },
            message: 'Successfully retrieved your favourite books.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Failed to retrieve favourite books.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getRequestBook = async (requester, requestBookId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
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

        // Find the specific book request in the array of request
        const bookRequest = requestBooks.requestBooks.find((book) => {
            console.log(book._id.toString());

            return book._id.toString() === requestBookId;
        });
        if (!bookRequest) {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'Book request not found.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Return the found book request
        return {
            timeStamp: new Date(),
            success: true,
            data: bookRequest,
            message: 'Successfully retrieved the book request.',
            status: httpStatus.OK,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            message: error.message || 'Failed to retrieve the book request.',
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
                message: 'No book request found to delete.',
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
                message: 'Book request removed successfully.',
                status: httpStatus.OK,
            };
        } else {
            return {
                timeStamp: new Date(),
                success: false,
                message: 'Book request not found in your records.',
                status: httpStatus.NOT_FOUND,
            };
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            message: 'Failed to remove the book request.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const writersService = {
    createRequestBook,
    getRequestBooks,
    getRequestBook,
    deleteRequestBook,
};

export default writersService;
