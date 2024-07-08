import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware
    from '../../../../middleware/authenticate.middleware.js';
import booksHistoryController from './booksHistory.controller.js';

const router = express.Router();

router
    .route('/')
    .get(authenticateMiddleware, booksHistoryController.getBooks)
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(authenticateMiddleware, booksHistoryController.getBook)
    .all(methodNotSupported);

export default router;
