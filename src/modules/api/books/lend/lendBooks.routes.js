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
 * @openapi
 * /lend-books:
 *   post:
 *     summary: Creates a lend book record.
 *     description: Creates a new lend book record with the provided data. Access is limited to admins.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: User ID of the lender.
 *               bookId:
 *                 type: string
 *                 description: Book ID of the book to lend.
 *               from:
 *                 type: string
 *                 format: date
 *                 description: Start date of the lending period.
 *               to:
 *                 type: string
 *                 format: date
 *                 description: End date of the lending period.
 *               remarks:
 *                 type: string
 *                 description: Additional remarks about the lending.
 *     responses:
 *       201:
 *         description: Lend book record created successfully.
 *       404:
 *         description: No book or user found with the provided ID.
 *       409:
 *         description: Book is already lent or already in your lend list.
 *       400:
 *         description: Invalid date provided for 'from' or 'to'.
 *     tags:
 *       - Lend Books Management
 *   get:
 *     summary: Retrieves all lend book records.
 *     description: Retrieves all lend book records for the authenticated admin user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved lend book records.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of lend books.
 *                 lendBooks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LendBook'
 *       404:
 *         description: No lend books found.
 *     tags:
 *       - Lend Books Management
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Lend Books Management
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
