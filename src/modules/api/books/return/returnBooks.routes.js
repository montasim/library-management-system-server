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
 * @openapi
 * /:
 *   delete:
 *     summary: Process book return.
 *     description: Handles the return of a book by a user. This endpoint requires admin permissions to access.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user returning the book.
 *               bookId:
 *                 type: string
 *                 description: ID of the book being returned.
 *               remarks:
 *                 type: string
 *                 description: Optional remarks about the book return.
 *     responses:
 *       200:
 *         description: Book returned successfully.
 *       404:
 *         description: No lending record found for this book by the specified user.
 *       500:
 *         description: Internal server error, failed to process the return.
 *     tags:
 *       - Book Management
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Book Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.returnBooks.permissions.create
        ),
        returnBooksValidator.returnBooksSchema,
        returnBooksController.returnBook
    )
    .all(methodNotSupported);

export default router;
