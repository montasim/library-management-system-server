import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import lendBooksValidator from './lendBooks.validator.js';
import lendBooksController from './lendBooks.controller.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.lendBooks.permissions.create
        ),
        lendBooksValidator.createLendBooksSchema,
        lendBooksController.createLendBook
    )
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.lendBooks.permissions.getList
        ),
        lendBooksValidator.getLendBooksQuerySchema,
        lendBooksController.getLendBooks
    )
    .all(methodNotSupported);

export default router;
