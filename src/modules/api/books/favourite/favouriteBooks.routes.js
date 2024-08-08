/**
 * @fileoverview This file defines and exports the Express router for handling favourite books-related operations.
 * The router includes routes for creating, retrieving, and deleting favourite books for authenticated users.
 * Each route is protected by authentication middleware and utilizes respective controller and validator functions.
 */

import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import favouriteBooksController from './favouriteBooks.controller.js';
import favouriteBooksValidator from './favouriteBooks.validator.js';
import routesConstants from '../../../../constant/routes.constants.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';

const router = express.Router();

/**
 * @openapi
 * /favouriteBooks:
 *   get:
 *     summary: Retrieves the list of favourite books.
 *     description: Fetches a list of favourite books for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favourite books retrieved successfully.
 *       404:
 *         description: No favourite books found.
 *     tags:
 *       - Favourite Books
 *   all:
 *     summary: Handles unsupported methods for the root route.
 *     description: Returns an error if an unsupported HTTP method is used on the root route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Favourite Books
 */
router
    .route('/')
    .get(
        authenticateMiddleware(accessTypesConstants.USER),
        favouriteBooksController.getFavouriteBooks
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /favouriteBooks/{bookId}:
 *   post:
 *     summary: Adds a book to favourite.
 *     description: Adds a specified book to the favourite list of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to be added to favourites.
 *     requestBody:
 *       required: false
 *     responses:
 *       201:
 *         description: Book added to favourites successfully.
 *       409:
 *         description: Book already in favourites.
 *       404:
 *         description: No book found with the provided ID.
 *     tags:
 *       - Favourite Books
 *   delete:
 *     summary: Removes a book from favourites.
 *     description: Removes a specified book from the favourite list of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to be removed from favourites.
 *     responses:
 *       200:
 *         description: Book removed from favourites successfully.
 *       404:
 *         description: No favourite book found to remove or Book not found in your favourites.
 *     tags:
 *       - Favourite Books
 *   all:
 *     summary: Handles unsupported methods for book-specific routes.
 *     description: Returns an error if an unsupported HTTP method is used on book-specific routes.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Favourite Books
 */
router
    .route(`/:${routesConstants.favouriteBooks.params}`)
    .post(
        authenticateMiddleware(accessTypesConstants.USER),
        favouriteBooksValidator.favouriteBookIdParamSchema,
        favouriteBooksController.createFavouriteBook
    )
    .delete(
        authenticateMiddleware(accessTypesConstants.USER),
        favouriteBooksValidator.favouriteBookIdParamSchema,
        favouriteBooksController.deleteFavouriteBook
    )
    .all(methodNotSupported);

export default router;
