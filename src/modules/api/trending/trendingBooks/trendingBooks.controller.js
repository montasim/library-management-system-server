import asyncErrorHandlerService from '../../../../service/asyncErrorHandler.service.js';
import trendingBooksService from './trendingBooks.service.js';

const getTrendingBooks = asyncErrorHandlerService(async (req, res) => {
    const trendingBooksData = await trendingBooksService.getTrendingBooks();

    trendingBooksData.route = req.originalUrl;

    res.status(trendingBooksData.status).send(trendingBooksData);
});

const trendingBooksController = {
    getTrendingBooks,
};

export default trendingBooksController;
