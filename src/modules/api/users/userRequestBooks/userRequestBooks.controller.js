import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import requestBooksService from './userRequestBooks.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';

const getRequestBooks = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const requestBooksData =
        await requestBooksService.getRequestBooks(requester);

    requestBooksData.route = req.originalUrl;

    res.status(requestBooksData.status).send(requestBooksData);
});

const getRequestBook = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const requestBooksData = await requestBooksService.getRequestBook(
        requester,
        req.params.requestedBookId
    );

    requestBooksData.route = req.originalUrl;

    res.status(requestBooksData.status).send(requestBooksData);
});

const deleteRequestBook = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedRequestBookData = await requestBooksService.deleteRequestBook(
        requester,
        req.params.requestedBookId
    );

    deletedRequestBookData.route = req.originalUrl;

    res.status(deletedRequestBookData.status).send(deletedRequestBookData);
});

const userRequestBooksController = {
    getRequestBooks,
    getRequestBook,
    deleteRequestBook,
};

export default userRequestBooksController;
