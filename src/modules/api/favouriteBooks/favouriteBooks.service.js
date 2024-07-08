import FavouriteBooksModel from './favouriteBooks.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import UsersModel from '../users/users.model.js';
import BooksModel from '../books/books.model.js';

const createFavouriteBook = async (requester, favouriteBookId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to add favourite books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        // Assuming BooksModel contains the book details
        const bookDetails = await BooksModel.findById(favouriteBookId);
        if (!bookDetails) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'No book found with the provided ID.',
                status: httpStatus.NOT_FOUND,
            };
        }

        // Find existing document for the user
        const existingFavourite = await FavouriteBooksModel.findOne({ owner: requester });
        if (existingFavourite) {
            // Prevent adding duplicate book IDs
            if (existingFavourite.favouriteBooks.includes(favouriteBookId)) {
                return {
                    timeStamp: new Date(),
                    success: false,
                    data: {},
                    message: 'This book is already in your favourites.',
                    status: httpStatus.CONFLICT,  // Changed status to indicate conflict
                };
            }

            existingFavourite.favouriteBooks.push(favouriteBookId);
            await existingFavourite.save();

            return {
                timeStamp: new Date(),
                success: true,
                data: existingFavourite,
                message: 'Book added to your favourites successfully.',
                status: httpStatus.OK,
            };
        } else {
            // Create a new document if none exists
            const newFavouriteBook = await FavouriteBooksModel.create({
                owner: requester,
                favouriteBooks: [favouriteBookId],
            });

            return {
                timeStamp: new Date(),
                success: true,
                data: newFavouriteBook,
                message: 'Book added to your favourites.',
                status: httpStatus.CREATED,
            };
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Failed to process your request to add a favourite book.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getFavouriteBooks = async (requester) => {
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

        const favouriteBooks = await FavouriteBooksModel.findOne({ owner: requester })
            .populate({
                path: 'favouriteBooks',
                select: '-bestSeller -review -price -stockAvailable -createdBy -createdAt -updatedAt',
                populate: [
                    {
                        path: 'subject',
                        model: 'Subjects',
                        select: 'name -_id'
                    },
                    {
                        path: 'publication',
                        model: 'Publications',
                        select: 'name -_id'
                    }
                ]
            });

        if (!favouriteBooks || favouriteBooks.favouriteBooks.length === 0) {
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
                total: favouriteBooks.favouriteBooks.length,
                favouriteBooks: favouriteBooks.favouriteBooks
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

const deleteFavouriteBook = async (requester, favouriteBookId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'You are not authorized to delete favourite books.',
                status: httpStatus.FORBIDDEN,
            };
        }

        const favouriteBooks = await FavouriteBooksModel.findOne({ owner: requester });

        if (!favouriteBooks) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'No favourite books found to remove.',
                status: httpStatus.NOT_FOUND,
            };
        }

        const index = favouriteBooks.favouriteBooks.indexOf(favouriteBookId);
        if (index > -1) {
            favouriteBooks.favouriteBooks.splice(index, 1);
            await favouriteBooks.save();
            return {
                timeStamp: new Date(),
                success: true,
                data: { removedBookId: favouriteBookId },
                message: 'Book removed from your favourites successfully.',
                status: httpStatus.OK,
            };
        } else {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Book not found in your favourites.',
                status: httpStatus.NOT_FOUND,
            };
        }
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Failed to remove the book from your favourites.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const writersService = {
    createFavouriteBook,
    getFavouriteBooks,
    deleteFavouriteBook,
};

export default writersService;
