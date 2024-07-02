import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import booksService from './books.service.js';

const createBook = asyncErrorHandler(async (req, res) => {
    const newBookData = await booksService.createBook(req.body);

    newBookData.route = req.originalUrl;

    res.status(newBookData.status).send(newBookData);
});

const getBooks = asyncErrorHandler(async (req, res) => {
    const booksData = await booksService.getBooks(req.query);

    booksData.route = req.originalUrl;

    res.status(booksData.status).send(booksData);
});

const getBook = asyncErrorHandler(async (req, res) => {
    const bookData = await booksService.getBook(req.params.bookId);

    bookData.route = req.originalUrl;

    res.status(bookData.status).send(bookData);
});

const updateBook = asyncErrorHandler(async (req, res) => {
    const updatedBookData = await booksService.updateBook(
        req.params.bookId,
        req.body
    );

    updatedBookData.route = req.originalUrl;

    res.status(updatedBookData.status).send(updatedBookData);
});

const deleteBooks = asyncErrorHandler(async (req, res) => {
    const bookIds = req.query.ids.split(',');
    const deletedBooksData = await booksService.deleteBooks(bookIds);

    deletedBooksData.route = req.originalUrl;

    res.status(deletedBooksData.status).send(deletedBooksData);
});

const deleteBook = asyncErrorHandler(async (req, res) => {
    const deletedBookData = await booksService.deleteBook(req.params.bookId);

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
