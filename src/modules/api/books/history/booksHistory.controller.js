import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import booksHistoryService from './booksHistory.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';

const getBooksHistory = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await booksHistoryService.getBooksHistory(
        requester,
        req.query
    );

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const getBookHistory = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await booksHistoryService.getBookHistory(
        requester,
        req.params.bookId
    );

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const booksHistoryController = {
    getBooksHistory,
    getBookHistory,
};

export default booksHistoryController;
