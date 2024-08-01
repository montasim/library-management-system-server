import userBookHistoryService from './userBookHistory.service.js';
import entity from '../../../../shared/entity.js';

const userBookHistoryController = {
    getBooksHistory: entity.getEntityByRequester(
        userBookHistoryService,
        'getBooksHistory'
    ),
    getBookHistoryByBookId: entity.getEntityById(
        userBookHistoryService,
        'getBookHistoryByBookId',
        'bookId'
    ),
};

export default userBookHistoryController;
