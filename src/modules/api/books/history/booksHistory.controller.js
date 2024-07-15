import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import booksHistoryService from './booksHistory.service.js';

const getBooksHistory = asyncErrorHandler(async (req, res) => {
    const booksHistoryData = await booksHistoryService.getBooksHistory(
        req.query
    );

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const getBookHistory = asyncErrorHandler(async (req, res) => {
    const booksHistoryData = await booksHistoryService.getBookHistory(
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
