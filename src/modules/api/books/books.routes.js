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
 * Route for creating, retrieving, and deleting books.
 * Includes middleware for authentication, validation, file upload, and caching.
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
 * Route for retrieving, updating, and deleting a specific book by ID.
 * Includes middleware for authentication, validation, file upload, and caching.
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
