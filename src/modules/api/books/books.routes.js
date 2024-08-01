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

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.books.permissions.create
        ),
        // TODO: fix validation when using formdata
        // booksValidator.createBook,
        uploadMiddleware.single('image'),
        booksController.createBook,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .get(
        booksValidator.getBooks,
        booksController.getBooks,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.books.permissions.deleteByList
        ),
        booksValidator.deleteBooks,
        booksController.deleteBooks,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .all(methodNotSupported);

router.use(`/${routesConstants.desiredBooks.routes}`, desiredBooksRoutes);
router.use(`/${routesConstants.favouriteBooks.routes}`, favouriteBooksRoutes);
router.use(`/${routesConstants.booksHistory.routes}`, booksHistoryRoutes);
router.use(`/${routesConstants.lendBooks.routes}`, lendBooksRoutes);
router.use(`/${routesConstants.requestBooks.routes}`, requestBooksRoutes);
router.use(`/${routesConstants.returnBooks.routes}`, returnBooksRoutes);

router
    .route(`/:${routesConstants.books.params}`)
    .get(
        booksValidator.getBook,
        booksController.getBook,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.books.permissions.updateById
        ),
        booksValidator.updateBook,
        uploadMiddleware.single('image'),
        booksController.updateBook,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.books.permissions.deleteById
        ),
        booksValidator.deleteBook,
        booksController.deleteBook,
        cacheMiddleware.invalidate(routesConstants.books.routes)
    )
    .all(methodNotSupported);

export default router;
