import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import trendingBooksService from './trendingBooks.service.js';

const getTrendingBooks = asyncErrorHandler(async (req, res) => {
    const trendingBooksData = await trendingBooksService.getTrendingBooks();

    trendingBooksData.route = req.originalUrl;

    res.status(trendingBooksData.status).send(trendingBooksData);
});

const trendingBooksController = {
    getTrendingBooks,
};

export default trendingBooksController;
