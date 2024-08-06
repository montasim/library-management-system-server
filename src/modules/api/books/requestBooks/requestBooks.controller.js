import requestBooksService from './requestBooks.service.js';
import entity from '../../../../shared/entity.js';
import routesConstants from '../../../../constant/routes.constants.js';

const requestBooksController = {
    createRequestBook: entity.createEntity(
        requestBooksService,
        'createRequestBook'
    ),
    getRequestBooks: entity.getEntityList(
        requestBooksService,
        'getRequestBooks'
    ),
    getRequestBookByBookId: entity.getEntityById(
        requestBooksService,
        'getRequestBook',
        routesConstants.requestBooks.params
    ),
    getRequestedBooksByOwnerId: entity.getEntityById(
        requestBooksService,
        'getRequestedBooksByOwnerId',
        'ownerId'
    ),
    deleteRequestBook: entity.deleteEntityById(
        requestBooksService,
        'deleteRequestBook',
        routesConstants.requestBooks.params
    ),
};

export default requestBooksController;
