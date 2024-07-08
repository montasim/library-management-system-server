import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import favouriteBooksService from '../favouriteBooks/favouriteBooks.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createFavouriteBook = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const newFavouriteBookData = await favouriteBooksService.createFavouriteBook(requester, req.params.favouriteBookId);

    newFavouriteBookData.route = req.originalUrl;

    res.status(newFavouriteBookData.status).send(newFavouriteBookData);
});

const getFavouriteBooks = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const favouriteBooksData = await favouriteBooksService.getFavouriteBooks(requester);

    favouriteBooksData.route = req.originalUrl;

    res.status(favouriteBooksData.status).send(favouriteBooksData);
});

const deleteFavouriteBook = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedFavouriteBookData = await favouriteBooksService.deleteFavouriteBook(requester, req.params.favouriteBookId);

    deletedFavouriteBookData.route = req.originalUrl;

    res.status(deletedFavouriteBookData.status).send(deletedFavouriteBookData);
});

const favouriteBooksController = {
    createFavouriteBook,
    getFavouriteBooks,
    deleteFavouriteBook,
};

export default favouriteBooksController;
