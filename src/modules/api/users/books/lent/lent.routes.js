/**
 * @fileoverview This file defines the routes for user-lent books operations. The routes include
 * endpoints to retrieve the list of lent books for a user, fetch the details of a specific lent book,
 * and delete a specific lent book. The routes apply validation middleware to ensure request parameters
 * are correctly formatted, and use controller methods to handle the business logic for each operation.
 */

import express from 'express';

import lentController from './lent.controller.js';
import methodNotSupported from '../../../../../shared/methodNotSupported.js';
import lentValidator from './lent.validator.js';

const router = express.Router();

/**
 * @openapi
 * /user-lent-books:
 *   get:
 *     summary: Retrieves a list of lent books for the authenticated user.
 *     description: Returns a list of all books lent by the authenticated user, including details like book ID, title, and status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of lent books retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of lent books.
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
 *       - User Lent Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - User Lent Books
 */
router.route('/').get(lentController.getLentBooks).all(methodNotSupported);

/**
 * @openapi
 * /user-lent-books/{lentBookId}:
 *   get:
 *     summary: Retrieves details of a specific lent book.
 *     description: Returns the details of a specific lent book identified by its unique ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lentBookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the lent book.
 *     responses:
 *       200:
 *         description: Lent book details retrieved successfully.
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
 *         description: Lent book not found.
 *     tags:
 *       - User Lent Books
 *   delete:
 *     summary: Deletes a specific lent book.
 *     description: Removes a specific lent book identified by its unique ID from the user's lent books list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lentBookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the lent book to be deleted.
 *     responses:
 *       200:
 *         description: Lent book deleted successfully.
 *       404:
 *         description: Lent book not found or already deleted.
 *     tags:
 *       - User Lent Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - User Lent Books
 */
router
    .route('/:lentBookId')
    .get(lentValidator.lentBookId, lentController.getLentBook)
    .all(methodNotSupported);

export default router;
