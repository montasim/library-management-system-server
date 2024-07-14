import express from 'express';

import userRequestBooksController from './userRequestBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import userRequestBooksValidator from './userRequestBooks.validator.js';

const router = express.Router();

router
    .route('/')
    .get(
        userRequestBooksController.getRequestBooks
    )
    .all(methodNotSupported);

router
    .route('/:requestedBookId')
    .get(
        userRequestBooksValidator.requestBookId,
        userRequestBooksController.getRequestBook
    )
    .delete(userRequestBooksValidator.requestBookId, userRequestBooksController.deleteRequestBook)
    .all(methodNotSupported);

export default router;
