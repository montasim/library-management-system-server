import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import booksService from './books.service.js';

const createBook = asyncErrorHandler(async (req, res) => {
    const {
        bestSeller,
        image,
        review,
        writer,
        subject,
        publication,
        page,
        edition,
        summary,
        price,
        stockAvailable,
        createdB,
    } = req.body;
    const bookData = {
        bestSeller,
        image,
        review,
        writer,
        subject,
        publication,
        page,
        edition,
        summary,
        price,
        stockAvailable,
        createdB,
    };
    const newBookData = await booksService.createBook(req, bookData);

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
