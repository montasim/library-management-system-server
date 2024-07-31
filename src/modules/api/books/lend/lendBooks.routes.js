import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import lendBooksValidator from './lendBooks.validator.js';
import lendBooksController from './lendBooks.controller.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware,
        lendBooksValidator.createLendBooksSchema,
        lendBooksController.createLendBook
    )
    .get(
        authenticateMiddleware,
        lendBooksValidator.getLendBooksQuerySchema,
        lendBooksController.getLendBooks
    )
    .all(methodNotSupported);

export default router;
