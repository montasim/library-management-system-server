/**
 * @fileoverview This file sets up the Express router for handling book return operations.
 * The router includes a DELETE endpoint for processing book return requests, with authentication
 * and validation middleware applied. Unsupported methods are handled appropriately.
 */

import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import returnBooksValidator from './returnBooks.validator.js';
import returnBooksController from './returnBooks.controller.js';
import routesConstants from '../../../../constant/routes.constants.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';

const router = express.Router();

/**
 * DELETE / - Endpoint for returning a book.
 * This endpoint is protected by authentication middleware and requires appropriate permissions.
 * It uses validation middleware to ensure the request data is valid before passing it to the controller.
 */
router
    .route('/')
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.returnBooks.permissions.create
        ),
        returnBooksValidator.returnBooksSchema,
        returnBooksController.returnBook
    )
    .all(methodNotSupported);

export default router;
