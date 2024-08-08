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
 * @openapi
 * /booksHistory/:
 *   get:
 *     summary: Retrieve the history of books.
 *     description: Fetches the history of books based on query parameters including pagination and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit for the number of records per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort order and field.
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: string
 *         description: Filter by book ID.
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter by user ID.
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: Start date for filtering the lending period.
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: End date for filtering the lending period.
 *     responses:
 *       200:
 *         description: Successfully retrieved the history of books.
 *       404:
 *         description: No books history found.
 *     tags:
 *       - Books History Management
 *   all:
 *     summary: Handles unsupported methods for the root route.
 *     description: Returns an error if an unsupported HTTP method is used on the root route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Books History Management
 */
router
    .route('/')
    .get(
        booksHistoryValidator.booksQueryParamSchema,
        booksHistoryController.getBooksHistory
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /booksHistory/{bookId}:
 *   get:
 *     summary: Retrieve the history of a specific book.
 *     description: Fetches the history of a specified book by its ID.
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve history for.
 *     responses:
 *       200:
 *         description: Successfully retrieved the history for the specified book.
 *       404:
 *         description: No book history found for the specified ID.
 *     tags:
 *       - Books History Management
 *   all:
 *     summary: Handles unsupported methods for the book ID route.
 *     description: Returns an error if an unsupported HTTP method is used on the book ID route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Books History Management
 */
router
    .route(`/:${routesConstants.booksHistory.params}`)
    .get(
        booksHistoryValidator.bookIdParamSchema,
        booksHistoryController.getBookHistory
    )
    .all(methodNotSupported);

export default router;
