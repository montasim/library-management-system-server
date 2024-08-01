import recentlyVisitedBooksService from './recentlyVisitedBooks.service.js';
import entity from '../../../../shared/entity.js';

const recentlyVisitedBooksController = {
    add: entity.createEntity(
        recentlyVisitedBooksService,
        'add'
    ),
    get: entity.getEntityByRequester(
        recentlyVisitedBooksService,
        'get',
    ),
};

export default recentlyVisitedBooksController;
