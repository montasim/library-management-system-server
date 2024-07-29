import asyncErrorHandlerService from '../../../../service/asyncErrorHandler.service.js';
import favouriteBooksService from './favouriteBooks.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';

const createFavouriteBook = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newFavouriteBookData =
        await favouriteBooksService.createFavouriteBook(
            requester,
            req.params.favouriteBookId
        );

    newFavouriteBookData.route = req.originalUrl;

    res.status(newFavouriteBookData.status).send(newFavouriteBookData);
});

const getFavouriteBooks = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const favouriteBooksData =
        await favouriteBooksService.getFavouriteBooks(requester);

    favouriteBooksData.route = req.originalUrl;

    res.status(favouriteBooksData.status).send(favouriteBooksData);
});

const deleteFavouriteBook = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedFavouriteBookData =
        await favouriteBooksService.deleteFavouriteBook(
            requester,
            req.params.favouriteBookId
        );

    deletedFavouriteBookData.route = req.originalUrl;

    res.status(deletedFavouriteBookData.status).send(deletedFavouriteBookData);
});

const favouriteBooksController = {
    createFavouriteBook,
    getFavouriteBooks,
    deleteFavouriteBook,
};

export default favouriteBooksController;
