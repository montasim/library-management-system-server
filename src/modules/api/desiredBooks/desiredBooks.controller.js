import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import desiredBooksService from './desiredBooks.service.js';

const getDesiredBooks = asyncErrorHandler(async (req, res) => {
    const desiredBooksData = await desiredBooksService.getDesiredBooks();

    desiredBooksData.route = req.originalUrl;

    res.status(desiredBooksData.status).send(desiredBooksData);
});

const desiredBooksController = {
    getDesiredBooks,
};

export default desiredBooksController;
