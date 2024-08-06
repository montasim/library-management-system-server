import userBookHistoryService from './userBookHistory.service.js';
import controller from '../../../../shared/controller.js';

const userBookHistoryController = {
    getBooksHistory: controller.getByRequester(
        userBookHistoryService,
        'getBooksHistory'
    ),
    getBookHistoryByBookId: controller.getById(
        userBookHistoryService,
        'getBookHistoryByBookId',
        'bookId'
    ),
};

export default userBookHistoryController;
