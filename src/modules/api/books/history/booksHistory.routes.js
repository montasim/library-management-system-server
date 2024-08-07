/**
 * @fileoverview This file sets up the routes for handling books history-related requests.
 * It includes routes for getting the history of books and for getting the history of a specific book by its ID.
 * The routes are validated using schemas and handled by the respective controllers.
 */

import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import booksHistoryValidator from './booksHistory.validator.js';
import booksHistoryController from './booksHistory.controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const router = express.Router();

/**
 * Route for getting the history of books.
 * @name GET /books-history
 * @function
 * @memberof module:booksHistory
 * @inner
 * @param {Function} booksHistoryValidator.booksQueryParamSchema - Middleware for validating the query parameters.
 * @param {Function} booksHistoryController.getBooksHistory - Controller for handling the request to get the history of books.
 */
router
    .route('/')
    .get(
        booksHistoryValidator.booksQueryParamSchema,
        booksHistoryController.getBooksHistory
    )
    .all(methodNotSupported);

/**
 * Route for getting the history of a specific book by its ID.
 * @name GET /books-history/:bookId
 * @function
 * @memberof module:booksHistory
 * @inner
 * @param {Function} booksHistoryValidator.bookIdParamSchema - Middleware for validating the book ID parameter.
 * @param {Function} booksHistoryController.getBookHistory - Controller for handling the request to get the history of a specific book by its ID.
 */
router
    .route(`/:${routesConstants.booksHistory.params}`)
    .get(
        booksHistoryValidator.bookIdParamSchema,
        booksHistoryController.getBookHistory
    )
    .all(methodNotSupported);

export default router;
