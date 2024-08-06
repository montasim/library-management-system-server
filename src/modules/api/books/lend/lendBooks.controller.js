import lendBooksService from './lendBooks.service.js';
import controller from '../../../../shared/controller.js';

const lendBooksController = {
    createLendBook: controller.create(lendBooksService, 'createLendBook'),
    getLendBooks: controller.getList(lendBooksService, 'getLendBooks'),
};

export default lendBooksController;
