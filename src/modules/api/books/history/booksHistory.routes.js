import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import booksHistoryValidator from './booksHistory.validator.js';
import booksHistoryController from './booksHistory.controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .get(
        booksHistoryValidator.booksQueryParamSchema,
        booksHistoryController.getBooksHistory
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.booksHistory.params}`)
    .get(
        booksHistoryValidator.bookIdParamSchema,
        booksHistoryController.getBookHistory
    )
    .all(methodNotSupported);

export default router;
