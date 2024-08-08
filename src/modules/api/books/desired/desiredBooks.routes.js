/**
 * @fileoverview This file sets up the Express router for desired books-related routes.
 * It includes a route for retrieving a list of desired books, using validation middleware
 * and a controller method to handle the request. It also includes a handler for unsupported methods.
 */

import express from 'express';

import desiredBooksValidator from './desiredBooks.validator.js';
import desiredBooksController from './desiredBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /desired-books:
 *   get:
 *     summary: Retrieves a list of desired books.
 *     description: Retrieves a list of the top 10 most desired books based on user requests. This endpoint uses MongoDB aggregation to fetch details of the most requested books.
 *     responses:
 *       200:
 *         description: A list of desired books successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status.
 *                 message:
 *                   type: string
 *                   description: A message describing the outcome of the operation.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookDetails:
 *                         type: object
 *                         description: Details of the book.
 *                       count:
 *                         type: integer
 *                         description: The number of times the book has been requested.
 *       404:
 *         description: No desired books found at the moment.
 *       500:
 *         description: Internal server error when attempting to fetch desired books.
 *     tags:
 *       - Book Management
 *   all:
 *     summary: Handles unsupported methods for the desired books endpoint.
 *     description: Returns an error if an unsupported HTTP method is used on the desired books endpoint.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Book Management
 */
router
    .route('/')
    .get(
        desiredBooksValidator.getDesiredBooks,
        desiredBooksController.getDesiredBooks
    )
    .all(methodNotSupported);

export default router;
