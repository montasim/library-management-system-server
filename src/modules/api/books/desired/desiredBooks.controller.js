import asyncErrorHandlerService from '../../../../service/asyncErrorHandler.service.js';
import desiredBooksService from './desiredBooks.service.js';

const getDesiredBooks = asyncErrorHandlerService(async (req, res) => {
    const desiredBooksData = await desiredBooksService.getDesiredBooks();

    desiredBooksData.route = req.originalUrl;

    res.status(desiredBooksData.status).send(desiredBooksData);
});

const desiredBooksController = {
    getDesiredBooks,
};

export default desiredBooksController;
