import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';
import recentlyVisitedBooksService from './recentlyVisitedBooks.service.js';

const add = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await recentlyVisitedBooksService.add(requester, req.body.book);

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const get = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const booksHistoryData = await recentlyVisitedBooksService.get(
        requester
    );

    booksHistoryData.route = req.originalUrl;

    res.status(booksHistoryData.status).send(booksHistoryData);
});

const recentlyVisitedBooksController = {
    add,
    get,
};

export default recentlyVisitedBooksController;
