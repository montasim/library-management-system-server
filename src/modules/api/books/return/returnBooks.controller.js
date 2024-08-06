import returnBooksService from './returnBooks.service.js';
import controller from '../../../../shared/controller.js';

const returnBooksController = {
    returnBook: controller.create(returnBooksService, 'returnBook'),
};

export default returnBooksController;
