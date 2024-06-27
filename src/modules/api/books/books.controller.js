import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import booksService from './books.service.js';

const createBook = asyncErrorHandler((req, res) => {
    const newBookData = booksService.getBooks(req);

    res.status(newBookData.status).send(newBookData);
});

const getBooks = asyncErrorHandler((req, res) => {
    const booksData = booksService.getBooks(req);

    res.status(booksData.status).send(booksData);
});

const updateBook = asyncErrorHandler((req, res) => {
    const updatedBookData = booksService.getBooks(req);

    res.status(updatedBookData.status).send(updatedBookData);
});

const deleteBook = asyncErrorHandler((req, res) => {
    const deletedBookData = booksService.getBooks(req);

    res.status(deletedBookData.status).send(deletedBookData);
});

const booksController = {
    createBook,
    getBooks,
    updateBook,
    deleteBook,
};

export default booksController;
