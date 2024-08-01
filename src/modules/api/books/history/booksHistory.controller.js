import booksHistoryService from './booksHistory.service.js';
import entity from '../../../../shared/entity.js';
import routesConstants from '../../../../constant/routes.constants.js';

const booksHistoryController = {
    getBooksHistory: entity.getEntityList(booksHistoryService, 'getBooksHistory'),
    getBookHistory: entity.getEntityById(
        booksHistoryService,
        'getBooksHistory',
        routesConstants.booksHistory.params
    ),
};

export default booksHistoryController;
