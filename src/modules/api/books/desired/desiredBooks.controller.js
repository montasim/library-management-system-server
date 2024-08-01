import desiredBooksService from './desiredBooks.service.js';
import entity from '../../../../shared/entity.js';

const desiredBooksController = {
    getDesiredBooks: entity.getEntityList(
        desiredBooksService,
        'getDesiredBooks'
    ),
};

export default desiredBooksController;
