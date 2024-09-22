/**
 * @fileoverview This file defines the routes for user-requested books operations. The routes include
 * endpoints to retrieve the list of requested books for a user, fetch the details of a specific requested book,
 * and delete a specific requested book. The routes apply validation middleware to ensure request parameters
 * are correctly formatted, and use controller methods to handle the business logic for each operation.
 */

import express from 'express';

import requestedController from './requested.controller.js';
import methodNotSupported from '../../../../../shared/methodNotSupported.js';
import requestedValidator from './requested.validator.js';

const router = express.Router();

/**
 * @openapi
 * /user-requested-books:
 *   get:
 *     summary: Retrieves a list of requested books for the authenticated user.
 *     description: Returns a list of all books requested by the authenticated user, including details like book ID, title, and status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requested books retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of requested books.
 *                 request:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the book.
 *                       title:
 *                         type: string
 *                         description: The title of the book.
 *                       status:
 *                         type: string
 *                         description: The status of the request (e.g., pending, approved, rejected).
 *       404:
 *         description: No books found for this user.
 *     tags:
 *       - User Requested Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - User Requested Books
 */
router
    .route('/')
    .get(requestedController.getRequestBooks)
    .all(methodNotSupported);

/**
 * @openapi
 * /user-requested-books/{requestedBookId}:
 *   get:
 *     summary: Retrieves details of a specific requested book.
 *     description: Returns the details of a specific requested book identified by its unique ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestedBookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the requested book.
 *     responses:
 *       200:
 *         description: Requested book details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the book.
 *                 title:
 *                   type: string
 *                   description: The title of the book.
 *                 status:
 *                   type: string
 *                   description: The status of the request.
 *       404:
 *         description: Requested book not found.
 *     tags:
 *       - User Requested Books
 *   delete:
 *     summary: Deletes a specific requested book.
 *     description: Removes a specific requested book identified by its unique ID from the user's requested books list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestedBookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the requested book to be deleted.
 *     responses:
 *       200:
 *         description: Requested book deleted successfully.
 *       404:
 *         description: Requested book not found or already deleted.
 *     tags:
 *       - User Requested Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - User Requested Books
 */
router
    .route('/:requestedBookId')
    .get(
        requestedValidator.requestBookId,
        requestedController.getRequestBook
    )
    .delete(
        requestedValidator.requestBookId,
        requestedController.deleteRequestBook
    )
    .all(methodNotSupported);

export default router;
