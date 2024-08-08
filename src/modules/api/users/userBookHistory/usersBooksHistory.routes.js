/**
 * @fileoverview This file defines the routes for user book history operations. The routes include
 * endpoints to retrieve the book history for a user and to fetch the history of a specific book.
 * The routes apply validation middleware to ensure request parameters are correctly formatted,
 * and use controller methods to handle the business logic for each operation.
 */

import express from 'express';

import userBookHistoryController from './userBookHistory.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import userBookHistoryValidator from './userBookHistory.validator.js';

const router = express.Router();

/**
 * @openapi
 * /user-book-history:
 *   get:
 *     summary: Retrieve book history for a user.
 *     description: Retrieves the book history including lending and returning records for the requesting user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved book history.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookHistory'
 *       404:
 *         description: No book history found for this user.
 *     tags:
 *       - User Book History
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - User Book History
 */
router
    .route('/')
    .get(
        userBookHistoryValidator.booksQueryParamSchema,
        userBookHistoryController.getBooksHistory
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /user-book-history/{bookId}:
 *   get:
 *     summary: Retrieve history of a specific book for a user.
 *     description: Fetches the lending and returning history of a specific book as it relates to the requesting user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book.
 *     responses:
 *       200:
 *         description: Successfully retrieved book history.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookHistory'
 *       404:
 *         description: No relevant book history found for this book.
 *     tags:
 *       - User Book History
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - User Book History
 */
router
    .route('/:bookId')
    .get(
        userBookHistoryValidator.bookIdParamSchema,
        userBookHistoryController.getBookHistoryByBookId
    )
    .all(methodNotSupported);

export default router;
