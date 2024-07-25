import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import requestBooksService from './requestBooks.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';

const createRequestBook = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const bookImage = req.file;
    const newRequestBookData = await requestBooksService.createRequestBook(
        requester,
        req.body,
        bookImage
    );

    newRequestBookData.route = req.originalUrl;

    res.status(newRequestBookData.status).send(newRequestBookData);
});

const getRequestBooks = asyncErrorHandler(async (req, res) => {
    const requestBooksData = await requestBooksService.getRequestBooks();

    requestBooksData.route = req.originalUrl;

    res.status(requestBooksData.status).send(requestBooksData);
});

const getRequestBookByBookId = asyncErrorHandler(async (req, res) => {
    const requestBooksData = await requestBooksService.getRequestBook(
        req.params.requestedBookId
    );

    requestBooksData.route = req.originalUrl;

    res.status(requestBooksData.status).send(requestBooksData);
});

const getRequestedBooksByOwnerId = asyncErrorHandler(async (req, res) => {
    const requestBooksData =
        await requestBooksService.getRequestedBooksByOwnerId(
            req.params.ownerId
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

const requestBooksController = {
    createRequestBook,
    getRequestBooks,
    getRequestBookByBookId,
    getRequestedBooksByOwnerId,
    deleteRequestBook,
};

export default requestBooksController;
