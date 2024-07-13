import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';
import userBookHistoryService from './userBookHistory.service.js';

const getBooksHistory = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await userBookHistoryService.getBooksHistory(requester);

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const getBookHistoryByBookId = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await userBookHistoryService.getBookHistoryByBookId(
        requester,
        req.params.bookId
    );

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const userBookHistoryController = {
    getBooksHistory,
    getBookHistoryByBookId,
};

export default userBookHistoryController;
