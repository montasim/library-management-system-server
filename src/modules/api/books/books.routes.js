/**
 * @fileoverview This file defines the Express router for managing books and related operations.
 * It sets up routes for creating, retrieving, updating, and deleting books, and includes sub-routes for desired books,
 * favourite books, books history, lending books, requesting books, and returning books. The routes are protected by
 * authentication and authorization middleware, and utilize cache middleware to optimize performance.
 */

import express from 'express';

import booksValidator from './books.validator.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import booksController from './books.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import desiredBooksRoutes from './desired/desiredBooks.routes.js';
import favouriteBooksRoutes from './favourite/favouriteBooks.routes.js';
import booksHistoryRoutes from './history/booksHistory.routes.js';
import lendBooksRoutes from './lend/lendBooks.routes.js';
import requestBooksRoutes from './requestBooks/requestBooks.routes.js';
import returnBooksRoutes from './return/returnBooks.routes.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';

const router = express.Router();

/**
 * @openapi
 * /books/:
 *   post:
 *     summary: Create a new book.
 *     description: This endpoint allows admin users to create a new book record, including uploading an image for the book.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the book.
 *               writer:
 *                 type: string
 *                 description: ID of the writer.
 *               publication:
 *                 type: string
 *                 description: ID of the publication.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the book.
 *     responses:
 *       201:
 *         description: Book created successfully.
 *       400:
 *         description: Validation error or bad request.
 *     tags:
 *       - Book Management
 *   get:
 *     summary: Get a list of books.
 *     description: Retrieves a list of books based on optional query parameters.
 *     responses:
 *       200:
 *         description: A list of books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *     tags:
 *       - Book Management
 *   delete:
 *     summary: Delete multiple books.
 *     description: Allows admin users to delete multiple books based on a list of book IDs.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of book IDs to delete.
 *     responses:
 *       200:
 *         description: Books deleted successfully.
 *     tags:
 *       - Book Management
 *   all:
 *     summary: Handles unsupported methods for the main books route.
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
            routesConstants.books.permissions.create
        ),
        // TODO: fix validation when using formdata
        // booksValidator.createNewBook,
        uploadMiddleware.single('image'),
        booksController.createNewBook,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .get(
        booksValidator.getBookList,
        booksController.getBookList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.books.permissions.deleteByList
        ),
        booksValidator.deleteBookList,
        booksController.deleteBookList,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .all(methodNotSupported);

/**
 * Sub-routes for managing desired books.
 */
router.use(`/${routesConstants.desiredBooks.routes}`, desiredBooksRoutes);

/**
 * Sub-routes for managing favourite books.
 */
router.use(`/${routesConstants.favouriteBooks.routes}`, favouriteBooksRoutes);

/**
 * Sub-routes for managing books history.
 */
router.use(`/${routesConstants.booksHistory.routes}`, booksHistoryRoutes);

/**
 * Sub-routes for managing lending books.
 */
router.use(`/${routesConstants.lendBooks.routes}`, lendBooksRoutes);

/**
 * Sub-routes for managing requesting books.
 */
router.use(`/${routesConstants.requestBooks.routes}`, requestBooksRoutes);

/**
 * Sub-routes for managing returning books.
 */
router.use(`/${routesConstants.returnBooks.routes}`, returnBooksRoutes);

/**
 * @openapi
 * /books/{bookId}:
 *   get:
 *     summary: Get a book by ID.
 *     description: Retrieves detailed information about a specific book by its ID.
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve.
 *     responses:
 *       200:
 *         description: Detailed book information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *     tags:
 *       - Book Management
 *   put:
 *     summary: Update a book by ID.
 *     description: Updates details of a book including the option to update the image.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               writer:
 *                 type: string
 *               publication:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Book updated successfully.
 *       404:
 *         description: Book not found.
 *     tags:
 *       - Book Management
 *   delete:
 *     summary: Delete a book by ID.
 *     description: Deletes a single book by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to delete.
 *     responses:
 *       200:
 *         description: Book deleted successfully.
 *     tags:
 *       - Book Management
 *   all:
 *     summary: Handles unsupported methods for the book ID route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Book Management
 */
router
    .route(`/:${routesConstants.books.params}`)
    .get(
        booksValidator.getBookById,
        booksController.getBookById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.books.permissions.updateById
        ),
        booksValidator.updateBookById,
        uploadMiddleware.single('image'),
        booksController.updateBookById,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.books.permissions.deleteById
        ),
        booksValidator.deleteBookById,
        booksController.deleteBookById,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .all(methodNotSupported);

export default router;
