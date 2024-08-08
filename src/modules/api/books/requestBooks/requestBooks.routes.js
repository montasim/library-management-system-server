/**
 * @fileoverview This file defines and exports the Express router for handling request books-related endpoints.
 * The routes are protected by authentication middleware, validate input data using requestBooksValidator,
 * and delegate the actual request processing to requestBooksController. It supports operations for creating,
 * retrieving, and managing requested books.
 */

import express from 'express';

import requestBooksController from './requestBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import requestBooksValidator from './requestBooks.validator.js';
import uploadMiddleware from '../../../../middleware/upload.middleware.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';

const router = express.Router();

/**
 * Route to handle creation and retrieval of requested books.
 * - POST: Authenticated users can create a new book request. The request includes an image upload.
 * - GET: Authenticated admins can retrieve all requested books.
 * - All other methods are not supported.
 */
router
    .route('/')
    .post(
        authenticateMiddleware(accessTypesConstants.USER),
        uploadMiddleware.single('image'),
        requestBooksValidator.createRequestBook,
        requestBooksController.createRequestBook
    )
    .get(
        authenticateMiddleware(accessTypesConstants.ADMIN),
        requestBooksController.getRequestBooks
    )
    .all(methodNotSupported);

/**
 * Route to handle retrieval of a specific requested book by its ID.
 * - GET: Authenticated admins can retrieve a requested book by its ID.
 * - All other methods are not supported.
 */
router
    .route(`/:${routesConstants.requestBooks.params}`)
    .get(
        authenticateMiddleware(accessTypesConstants.ADMIN),
        requestBooksValidator.requestBookId,
        requestBooksController.getRequestBookByBookId
    )
    .all(methodNotSupported);

/**
 * Route to handle retrieval of requested books by owner ID.
 * - GET: Authenticated admins can retrieve requested books by the owner's ID.
 * - All other methods are not supported.
 */
router
    .route('/owner/:ownerId')
    .get(
        authenticateMiddleware(accessTypesConstants.ADMIN),
        requestBooksValidator.ownerId,
        requestBooksController.getRequestedBooksByOwnerId
    )
    .all(methodNotSupported);

export default router;
