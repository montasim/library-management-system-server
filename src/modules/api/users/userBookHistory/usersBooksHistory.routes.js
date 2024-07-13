import express from 'express';

import userBookHistoryController from './userBookHistory.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import userBookHistoryValidator from './userBookHistory.validator.js';

const router = express.Router();

router
    .route('/')
    .get(userBookHistoryValidator.booksQueryParamSchema, userBookHistoryController.getBooksHistory)
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(userBookHistoryValidator.bookIdParamSchema, userBookHistoryController.getBookHistoryByBookId)
    .all(methodNotSupported);

export default router;
