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
 * GET / - Route to retrieve favourite books for the authenticated user.
 * Utilizes the favouriteBooksController.getFavouriteBooks controller function and is protected by authenticateMiddleware.
 *
 * @function
 */
router
    .route('/')
    .get(
        authenticateMiddleware(accessTypesConstants.USER),
        favouriteBooksController.getFavouriteBooks
    )
    .all(methodNotSupported);

/**
 * POST /:id - Route to create a favourite book for the authenticated user.
 * DELETE /:id - Route to delete a favourite book by its ID for the authenticated user.
 * Utilizes respective controller functions and validators for parameter validation.
 *
 * @function
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
