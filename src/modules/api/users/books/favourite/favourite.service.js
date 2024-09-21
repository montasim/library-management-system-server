import FavouriteBooksModel from '../../../books/favourite/favouriteBooks.model.js';
import errorResponse from '../../../../../utilities/errorResponse.js';
import httpStatus from '../../../../../constant/httpStatus.constants.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import loggerService from '../../../../../service/logger.service.js';

/**
 * getFavourite - Retrieves the user's favourite books, populates related fields, and returns the list.
 * @param {ObjectId} requester - The ID of the user making the request.
 * @returns {Object} Response object containing the list of favourite books.
 */
const getFavourite = async (requester) => {
    try {
        const favourites = await FavouriteBooksModel.findOne({
            owner: requester,
        }).populate({
            path: 'favouriteBooks', // Updated from 'favourite' to 'favouriteBooks'
            select: '-bestSeller -review -price -stockAvailable -createdBy -createdAt -updatedAt',
            populate: [
                {
                    path: 'subject',
                    model: 'Subjects',
                    select: 'name _id',
                },
                {
                    path: 'publication',
                    model: 'Publications',
                    select: 'name _id',
                },
            ],
        });

        if (!favourites || favourites.favouriteBooks.length === 0) {
            return sendResponse(
                {},
                'You have no favourite books.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                total: favourites.favouriteBooks.length,
                books: favourites.favouriteBooks,
            },
            'Successfully retrieved your favourite books.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get favourite books: ${error}`);

        return errorResponse(
            error.message || 'Failed to get favourite books.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * deleteFavouriteBook - Removes a book from the user's favourites.
 * @param {ObjectId} requester - The ID of the user making the request.
 * @param {ObjectId} favouriteBookId - The ID of the book to be removed from favourites.
 * @returns {Object} Response object indicating success or failure.
 */
const deleteFavouriteBook = async (requester, favouriteBookId) => {
    try {
        const favourite = await FavouriteBooksModel.findOne({
            owner: requester,
        });
        if (!favourite) {
            return sendResponse(
                {},
                'No favourite books found to remove.',
                httpStatus.NOT_FOUND
            );
        }

        const index = favourite.favouriteBooks.indexOf(favouriteBookId); // Updated from favourite.favourite
        if (index > -1) {
            favourite.favouriteBooks.splice(index, 1); // Updated from favourite.favourite
            await favourite.save();

            return sendResponse(
                { removedBookId: favouriteBookId },
                'Book removed from your favourites successfully.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {},
            'Book not found in your favourites.',
            httpStatus.OK
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
 * An object that holds service functions for favourite books operations.
 */
const writersService = {
    getFavourite,
    deleteFavouriteBook,
};

export default writersService;
