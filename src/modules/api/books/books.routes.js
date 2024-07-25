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

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware.admin,
        // booksValidator.createBook,
        uploadMiddleware.single('image'),
        booksController.createBook
    )
    .get(booksValidator.getBooks, booksController.getBooks)
    .delete(
        authenticateMiddleware.admin,
        booksValidator.deleteBooks,
        booksController.deleteBooks
    )
    .all(methodNotSupported);

router.use('/desired', desiredBooksRoutes);
router.use('/favourite', favouriteBooksRoutes);
router.use('/history', booksHistoryRoutes);
router.use('/lend', lendBooksRoutes);
router.use('/request', requestBooksRoutes);
router.use('/return', returnBooksRoutes);

router
    .route(`/${routesConstants.books.params}`)
    .get(booksValidator.getBook, booksController.getBook)
    .put(
        authenticateMiddleware.admin,
        booksValidator.updateBook,
        uploadMiddleware.single('image'),
        booksController.updateBook
    )
    .delete(
        authenticateMiddleware.admin,
        booksValidator.deleteBook,
        booksController.deleteBook
    )
    .all(methodNotSupported);

export default router;
