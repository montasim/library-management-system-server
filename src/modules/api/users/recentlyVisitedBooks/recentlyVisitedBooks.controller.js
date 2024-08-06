import recentlyVisitedBooksService from './recentlyVisitedBooks.service.js';
import controller from '../../../../shared/controller.js';

const recentlyVisitedBooksController = {
    add: controller.create(
        recentlyVisitedBooksService,
        'add'
    ),
    get: controller.getByRequester(
        recentlyVisitedBooksService,
        'get',
    ),
};

export default recentlyVisitedBooksController;
