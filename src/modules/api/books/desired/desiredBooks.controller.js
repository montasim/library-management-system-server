import desiredBooksService from './desiredBooks.service.js';
import controller from '../../../../shared/controller.js';

const desiredBooksController = {
    getDesiredBooks: controller.getList(
        desiredBooksService,
        'getDesiredBooks'
    ),
};

export default desiredBooksController;
