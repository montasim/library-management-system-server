import returnBooksService from './returnBooks.service.js';
import entity from '../../../../shared/entity.js';

const returnBooksController = {
    returnBook: entity.createEntity(returnBooksService, 'returnBook'),
};

export default returnBooksController;
