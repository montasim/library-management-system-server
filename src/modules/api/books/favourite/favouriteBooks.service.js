import FavouriteBooksModel from './favouriteBooks.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import BooksModel from '../books.model.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

const createFavouriteBook = async (requester, favouriteBookId) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to create favourite book.',
            httpStatus.FORBIDDEN
        );
    }

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
};

const getFavouriteBooks = async (requester) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to get favourite books.',
            httpStatus.FORBIDDEN
        );
    }

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
};

const deleteFavouriteBook = async (requester, favouriteBookId) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to delete favourite books.',
            httpStatus.FORBIDDEN
        );
    }

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
};

const writersService = {
    createFavouriteBook,
    getFavouriteBooks,
    deleteFavouriteBook,
};

export default writersService;
