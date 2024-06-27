import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import booksService from './books.service.js';

const booksController = asyncErrorHandler((req, res) => {
    const booksData = booksService(req);

    res.status(booksData.status).send(booksData);
});

export default booksController;
