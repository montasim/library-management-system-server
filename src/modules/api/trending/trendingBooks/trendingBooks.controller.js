import trendingBooksService from './trendingBooks.service.js';
import entity from '../../../../shared/entity.js';

const trendingBooksController = {
    getTrendingBooks: entity.getEntityList(
        trendingBooksService,
        'getTrendingBooks'
    ),
};

export default trendingBooksController;
