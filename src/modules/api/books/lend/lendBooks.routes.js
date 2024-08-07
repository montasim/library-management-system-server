/**
 * @fileoverview This file sets up the express router for lend books-related endpoints.
 * It includes routes for creating and retrieving lend book records, with middleware for authentication and validation.
 * Routes that are not supported respond with a methodNotSupported handler.
 */

import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import lendBooksValidator from './lendBooks.validator.js';
import lendBooksController from './lendBooks.controller.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';

const router = express.Router();

/**
 * Route for creating and retrieving lend books.
 * - POST /: Create a new lend book record. Requires ADMIN access and validates the request body.
 * - GET /: Retrieve a list of lend books. Requires ADMIN access and validates the query parameters.
 * - ALL /: Responds with a methodNotSupported handler for unsupported HTTP methods.
 */
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
