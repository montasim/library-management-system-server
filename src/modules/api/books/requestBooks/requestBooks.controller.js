import requestBooksService from './requestBooks.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const requestBooksController = {
    createRequestBook: controller.create(
        requestBooksService,
        'createRequestBook'
    ),
    getRequestBooks: controller.getList(
        requestBooksService,
        'getRequestBooks'
    ),
    getRequestBookByBookId: controller.getById(
        requestBooksService,
        'getRequestBook',
        routesConstants.requestBooks.params
    ),
    getRequestedBooksByOwnerId: controller.getById(
        requestBooksService,
        'getRequestedBooksByOwnerId',
        'ownerId'
    ),
    deleteRequestBook: controller.deleteById(
        requestBooksService,
        'deleteRequestBook',
        routesConstants.requestBooks.params
    ),
};

export default requestBooksController;
