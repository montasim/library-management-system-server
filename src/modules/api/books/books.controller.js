import booksService from './books.service.js';
import entity from '../../../shared/entity.js';
import routesConstants from '../../../constant/routes.constants.js';

const booksController = {
    createBook: entity.createEntity(booksService, 'createBook'),
    getBooks: entity.getEntityList(
        booksService,
        'getBooks',
    ),
    getBook: entity.getEntityById(
        booksService,
        'getBook',
        routesConstants.books.params
    ),
    updateBook: entity.updateEntityById(
        booksService,
        'updateBook',
        routesConstants.books.params
    ),
    deleteBook: entity.deleteEntityById(
        booksService,
        'deleteBook',
        routesConstants.books.params
    ),
    deleteBooks: entity.deleteEntityList(
        booksService,
        'deleteBook',
    ),
};

export default booksController;
