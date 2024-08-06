import requestBooksService from './userRequestBooks.service.js';
import controller from '../../../../shared/controller.js';

const userRequestBooksController = {
    getRequestBooks: controller.getByRequester(
        requestBooksService,
        'getRequestBooks'
    ),
    getRequestBook: controller.getById(
        requestBooksService,
        'getRequestBook',
        'requestedBookId'
    ),
    deleteRequestBook: controller.deleteById(
        requestBooksService,
        'deleteRequestBook',
        'requestedBookId'
    ),
};

export default userRequestBooksController;
