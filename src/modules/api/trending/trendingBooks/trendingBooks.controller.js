import trendingBooksService from './trendingBooks.service.js';
import controller from '../../../../shared/controller.js';

const trendingBooksController = {
    getTrendingBooks: controller.getList(
        trendingBooksService,
        'getTrendingBooks'
    ),
};

export default trendingBooksController;
