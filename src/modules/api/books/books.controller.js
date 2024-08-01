import booksService from './books.service.js';
import entity from '../../../shared/entity.js';
import routesConstants from '../../../constant/routes.constants.js';

const booksController = {
    createNewBook: entity.createEntity(booksService, 'createNewBook'),
    getBookList: entity.getEntityList(booksService, 'getBookList'),
    getBookById: entity.getEntityById(
        booksService,
        'getBookById',
        routesConstants.books.params
    ),
    updateBookById: entity.updateEntityById(
        booksService,
        'updateBookById',
        routesConstants.books.params
    ),
    deleteBookById: entity.deleteEntityById(
        booksService,
        'deleteBookById',
        routesConstants.books.params
    ),
    deleteBookList: entity.deleteEntityList(booksService, 'deleteBookList'),
};

export default booksController;
