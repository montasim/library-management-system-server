import asyncErrorHandlerService from '../../../../service/asyncErrorHandler.service.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';
import returnBooksService from './returnBooks.service.js';

const returnBook = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const returnBooksData = await returnBooksService.returnBook(
        requester,
        req.body
    );

    returnBooksData.route = req.originalUrl;

    res.status(returnBooksData.status).send(returnBooksData);
});

const returnBooksController = {
    returnBook,
};

export default returnBooksController;
