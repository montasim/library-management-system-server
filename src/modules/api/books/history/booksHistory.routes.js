import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import booksHistoryController from './booksHistory.controller.js';
import booksHistoryValidator from './booksHistory.validator.js';

const router = express.Router();

router
    .route('/')
    .get(authenticateMiddleware, booksHistoryController.getBooks)
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(authenticateMiddleware, booksHistoryValidator.bookIdParamSchema, booksHistoryController.getBook)
    .all(methodNotSupported);

export default router;
