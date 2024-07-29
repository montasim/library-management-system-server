import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import booksService from './books.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createBook = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const bookImage = req.file;
    const newBookData = await booksService.createBook(
        requester,
        req.body,
        bookImage
    );

    newBookData.route = req.originalUrl;

    res.status(newBookData.status).send(newBookData);
});

const getBooks = asyncErrorHandlerService(async (req, res) => {
    const booksData = await booksService.getBooks(req.query);

    booksData.route = req.originalUrl;

    res.status(booksData.status).send(booksData);
});

const getBook = asyncErrorHandlerService(async (req, res) => {
    const bookData = await booksService.getBook(req.params.bookId);

    bookData.route = req.originalUrl;

    res.status(bookData.status).send(bookData);
});

const updateBook = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const bookImage = req.file;
    const updatedBookData = await booksService.updateBook(
        requester,
        req.params.bookId,
        req.body,
        bookImage
    );

    updatedBookData.route = req.originalUrl;

    res.status(updatedBookData.status).send(updatedBookData);
});

const deleteBooks = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const bookIds = req.query.ids.split(',');
    const deletedBooksData = await booksService.deleteBooks(requester, bookIds);

    deletedBooksData.route = req.originalUrl;

    res.status(deletedBooksData.status).send(deletedBooksData);
});

const deleteBook = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedBookData = await booksService.deleteBook(
        requester,
        req.params.bookId
    );

    deletedBookData.route = req.originalUrl;

    res.status(deletedBookData.status).send(deletedBookData);
});

const booksController = {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBooks,
    deleteBook,
};

export default booksController;
