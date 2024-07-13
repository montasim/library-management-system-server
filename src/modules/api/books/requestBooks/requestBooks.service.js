import httpStatus from '../../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import validateFile from '../../../../utilities/validateFile.js';
import requestBooksConstant from './requestBooks.constant.js';
import mimeTypesConstants from '../../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants
    from '../../../../constant/fileExtensions.constants.js';
import GoogleDriveFileOperations
    from '../../../../utilities/googleDriveFileOperations.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import RequestBooksModel from './requestBooks.model.js';

const createRequestBook = async (requester, bookData, bookImage) => {
    // Validate if the user is authorized to make a requestBooks
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to requestBooks book.',
            httpStatus.FORBIDDEN
        );
    }

    // Check for existing requestBooks document for the user
    const existingRequest = await RequestBooksModel.findOne({
        owner: requester,
    });
    if (existingRequest) {
        // Check for duplicate book requestBooks
        const isDuplicate = existingRequest.requestBooks.some(
            (book) => book.name === bookData.name
        );
        if (isDuplicate) {
            return errorResponse(
                'This book has already been requested.',
                httpStatus.CONFLICT
            );
        }

        // Validate the image file
        if (!bookImage) {
            return errorResponse(
                'Please provide an image.',
                httpStatus.BAD_REQUEST
            );
        }

        const fileValidationResults = validateFile(
            bookImage,
            requestBooksConstant.imageSize,
            [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
            [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
        );
        if (!fileValidationResults.isValid) {
            return errorResponse(
                fileValidationResults.message,
                httpStatus.BAD_REQUEST
            );
        }

        // Upload image and handle possible errors
        const bookImageData = await GoogleDriveFileOperations.uploadFile(bookImage);
        if (!bookImageData || bookImageData instanceof Error) {
            return errorResponse(
                'Failed to save image.',
                httpStatus.INTERNAL_SERVER_ERROR
            );
        }

        // Add the extra data
        bookData.image = bookImageData;
        bookData.createdBy = requester;

        // Add new book to the existing requestBooks document
        existingRequest.requestBooks.push(bookData);
        await existingRequest.save();

        return sendResponse(
            existingRequest,
            'New book requestBooks added successfully.',
            httpStatus.OK
        );
    } else {
        // Validate the image file
        if (!bookImage) {
            return errorResponse(
                'Please provide an image.',
                httpStatus.BAD_REQUEST
            );
        }

        const fileValidationResults = validateFile(
            bookImage,
            requestBooksConstant.imageSize,
            [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
            [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
        );
        if (!fileValidationResults.isValid) {
            return errorResponse(
                fileValidationResults.message,
                httpStatus.BAD_REQUEST
            );
        }

        // Upload image and handle possible errors
        const bookImageData = await GoogleDriveFileOperations.uploadFile(bookImage);
        if (!bookImageData || bookImageData instanceof Error) {
            return errorResponse(
                'Failed to save image.',
                httpStatus.INTERNAL_SERVER_ERROR
            );
        }

        // Add the extra data
        bookData.image = bookImageData;
        bookData.createdBy = requester;

        // Create a new requestBooks document if none exists
        const newRequest = await RequestBooksModel.create({
            owner: requester,
            requestBooks: [bookData],
        });

        return sendResponse(
            newRequest,
            'Book requested successfully.',
            httpStatus.OK
        );
    }
};

const getRequestBooks = async () => {
    const requestBooks = await RequestBooksModel.find()
        .populate(
            {
                path: 'owner',
                select: 'name _id'
            }
        ).lean();

    if (!requestBooks || requestBooks.length === 0) {
        return errorResponse(
            'You have no favourite books.',
            httpStatus.NOT_FOUND
        );
    }

    return sendResponse(
        {
            total: requestBooks.length,
            requestBooks: requestBooks,
        },
        'Successfully retrieved your favourite books.',
        httpStatus.OK
    );
};

const getRequestBook = async (bookId) => {
    // Attempt to find a request document that contains the specific book ID in its requestBooks array
    const request = await RequestBooksModel.findOne({
        'requestBooks._id': bookId  // Adjust this path if your book ID is stored differently
    })
        .populate('owner', 'username email')  // Populate owner details; adjust fields as necessary.
        .populate({
            path: 'requestBooks.writer',
            select: 'name biography'  // Populate writer details if it is stored as a reference.
        })
        .exec();

    // Check if the request was found
    if (!request) {
        return {
            timeStamp: new Date(),
            success: false,
            message: 'Requested book not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    // Extract the specific requested book from the requestBooks array
    const requestedBook = request.requestBooks.find(book => book._id.toString() === bookId);

    // Return the requested book if found
    if (!requestedBook) {
        return {
            timeStamp: new Date(),
            success: false,
            message: 'Requested book not found in the document.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: requestedBook,
        message: 'Successfully retrieved the requested book.',
        status: httpStatus.OK,
    };
};

const getRequestedBooksByOwnerId = async (ownerId) => {
    // Fetch all request documents for a specific owner
    const requests = await RequestBooksModel.find({ owner: ownerId })
        .populate('owner', 'username email')  // Populate owner details; adjust fields as necessary.
        .populate({
            path: 'requestBooks.writer',
            select: 'name biography'  // Populate writer details if it is stored as a reference.
        })
        .exec();

    // Check if there are any requests found
    if (!requests.length) {
        return {
            timeStamp: new Date(),
            success: false,
            message: 'No requested books found for this user.',
            status: httpStatus.NOT_FOUND,
        };
    }

    // Compile all requested books into one array
    const allRequestBooks = requests.flatMap(request => request.requestBooks.map(book => ({
        ...book.toObject(),
        owner: request.owner.username  // Optionally include owner details in each book.
    })));

    return {
        timeStamp: new Date(),
        success: true,
        data: {
            total: allRequestBooks.length,
            requestBooks: allRequestBooks,
        },
        message: 'Successfully retrieved requested books for the specified user.',
        status: httpStatus.OK,
    };
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
    createRequestBook,
    getRequestBooks,
    getRequestBook,
    getRequestedBooksByOwnerId,
    deleteRequestBook,
};

export default writersService;
