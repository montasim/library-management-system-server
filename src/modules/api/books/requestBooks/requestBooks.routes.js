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
 * @openapi
 * /request-books:
 *   post:
 *     summary: Create a new book request.
 *     description: Allows a user to create a new book request. This operation requires an image upload and user authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the requested book.
 *               title:
 *                 type: string
 *                 description: Title of the requested book.
 *               author:
 *                 type: string
 *                 description: Author of the requested book.
 *     responses:
 *       200:
 *         description: Book request created successfully.
 *       400:
 *         description: Invalid request data.
 *     tags:
 *       - Request Books
 *   get:
 *     summary: Retrieve all book requests.
 *     description: Fetches all book requests. Accessible only to admins.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all book requests.
 *       404:
 *         description: No book requests found.
 *     tags:
 *       - Request Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Request Books
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
 * @openapi
 * /request-books/{bookId}:
 *   get:
 *     summary: Retrieve a book request by ID.
 *     description: Fetches a specific book request by its ID. Accessible only to admins.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book request.
 *     responses:
 *       200:
 *         description: Successfully retrieved the book request.
 *       404:
 *         description: Book request not found.
 *     tags:
 *       - Request Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Request Books
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
 * @openapi
 * /request-books/owner/{ownerId}:
 *   get:
 *     summary: Retrieve book requests by owner ID.
 *     description: Fetches all book requests associated with a specific owner ID. Accessible only to admins.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ownerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book request owner.
 *     responses:
 *       200:
 *         description: Successfully retrieved book requests for the specified owner.
 *       404:
 *         description: No book requests found for this owner.
 *     tags:
 *       - Request Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Request Books
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
