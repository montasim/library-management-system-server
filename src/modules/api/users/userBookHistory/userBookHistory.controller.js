import asyncErrorHandlerService from '../../../../service/asyncErrorHandler.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';
import userBookHistoryService from './userBookHistory.service.js';

const getBooksHistory = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData =
        await userBookHistoryService.getBooksHistory(requester);

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const getBookHistoryByBookId = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData =
        await userBookHistoryService.getBookHistoryByBookId(
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
