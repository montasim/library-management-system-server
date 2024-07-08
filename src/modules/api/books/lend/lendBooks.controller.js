import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import lendBooksService from './lendBooks.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';

const createLendBook = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const newLendBookData = await lendBooksService.createLendBook(
        requester,
        req.body
    );

    newLendBookData.route = req.originalUrl;

    res.status(newLendBookData.status).send(newLendBookData);
});

const getLendBooks = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const lendBooksData = await lendBooksService.getLendBooks(requester);

    lendBooksData.route = req.originalUrl;

    res.status(lendBooksData.status).send(lendBooksData);
});

const lendBooksController = {
    createLendBook,
    getLendBooks,
};

export default lendBooksController;
