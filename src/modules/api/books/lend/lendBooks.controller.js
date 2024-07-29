import asyncErrorHandlerService from '../../../../service/asyncErrorHandler.service.js';
import lendBooksService from './lendBooks.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';

const createLendBook = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newLendBookData = await lendBooksService.createLendBook(
        requester,
        req.body
    );

    newLendBookData.route = req.originalUrl;

    res.status(newLendBookData.status).send(newLendBookData);
});

const getLendBooks = asyncErrorHandlerService(async (req, res) => {
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
