import requestBooksService from './userRequestBooks.service.js';
import entity from '../../../../shared/entity.js';

const userRequestBooksController = {
    getRequestBooks: entity.getEntityByRequester(
        requestBooksService,
        'getRequestBooks'
    ),
    getRequestBook: entity.getEntityById(
        requestBooksService,
        'getRequestBook',
        'requestedBookId'
    ),
    deleteRequestBook: entity.deleteEntityById(
        requestBooksService,
        'deleteRequestBook',
        'requestedBookId'
    ),
};

export default userRequestBooksController;
