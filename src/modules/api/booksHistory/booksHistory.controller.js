import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import booksHistoryService from '../booksHistory/booksHistory.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const getBooks = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await booksHistoryService.getBooksHistory(requester);

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const getBook = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await booksHistoryService.getBookHistory(requester, req.params.bookId);

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const booksHistoryController = {
    getBooks,
    getBook,
};

export default booksHistoryController;
