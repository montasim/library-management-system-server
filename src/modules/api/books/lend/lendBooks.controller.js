import lendBooksService from './lendBooks.service.js';
import entity from '../../../../shared/entity.js';

const lendBooksController = {
    createLendBook: entity.createEntity(lendBooksService, 'createLendBook'),
    getLendBooks: entity.getEntityList(lendBooksService, 'getLendBooks'),
};

export default lendBooksController;
