import express from 'express';

import desiredBooksValidator from './desiredBooks.validator.js';
import desiredBooksController from './desiredBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(
        desiredBooksValidator.getDesiredBooks,
        desiredBooksController.getDesiredBooks
    )
    .all(methodNotSupported);

export default router;
