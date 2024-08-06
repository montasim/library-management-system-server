import booksService from './books.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

const booksController = {
    createNewBook: controller.create(booksService, 'createNewBook'),
    getBookList: controller.getList(booksService, 'getBookList'),
    getBookById: controller.getById(
        booksService,
        'getBookById',
        routesConstants.books.params
    ),
    updateBookById: controller.updateById(
        booksService,
        'updateBookById',
        routesConstants.books.params
    ),
    deleteBookById: controller.deleteById(
        booksService,
        'deleteBookById',
        routesConstants.books.params
    ),
    deleteBookList: controller.deleteList(booksService, 'deleteBookList'),
};

export default booksController;
