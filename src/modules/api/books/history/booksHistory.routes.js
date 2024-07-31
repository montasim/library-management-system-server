import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import booksHistoryValidator from './booksHistory.validator.js';
import booksHistoryController from './booksHistory.controller.js';

const router = express.Router();

router
    .route('/')
    .get(
        authenticateMiddleware,
        booksHistoryValidator.booksQueryParamSchema,
        booksHistoryController.getBooksHistory
    )
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(
        authenticateMiddleware,
        booksHistoryValidator.bookIdParamSchema,
        booksHistoryController.getBookHistory
    )
    .all(methodNotSupported);

export default router;
