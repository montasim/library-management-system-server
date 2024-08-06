import booksHistoryService from './booksHistory.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const booksHistoryController = {
    getBooksHistory: controller.getList(
        booksHistoryService,
        'getBooksHistory'
    ),
    getBookHistory: controller.getById(
        booksHistoryService,
        'getBooksHistory',
        routesConstants.booksHistory.params
    ),
};

export default booksHistoryController;
