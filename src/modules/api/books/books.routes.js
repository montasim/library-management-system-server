import express from 'express';

import booksValidator from './books.validator.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import booksController from './books.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import requestBooksController from './request/requestBooks.controller.js';
import lendBooksController from './lend/lendBooks.controller.js';
import returnBooksController from './return/returnBooks.controller.js';
import lendBooksValidator from './lend/lendBooks.validator.js';
import returnBooksValidator from './return/returnBooks.validator.js';
import desiredBooksRoutes from './desired/desiredBooks.routes.js';
import favouriteBooksRoutes from './favourite/favouriteBooks.routes.js';
import booksHistoryRoutes from './history/booksHistory.routes.js';

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

router
    .route('/lend')
    .post(
        authenticateMiddleware.admin,
        lendBooksValidator.createLendBooksSchema,
        lendBooksController.createLendBook
    )
    .get(
        authenticateMiddleware.admin,
        lendBooksValidator.getLendBooksQuerySchema,
        lendBooksController.getLendBooks
    )
    .all(methodNotSupported);

router
    .route('/request')
    .post(authenticateMiddleware.user, requestBooksController.createRequestBook)
    .get(authenticateMiddleware.admin, requestBooksController.getRequestBooks)
    .all(methodNotSupported);

router
    .route('/request/:requestedBookId')
    .get(authenticateMiddleware.admin, requestBooksController.getRequestBook)
    .delete(authenticateMiddleware.admin, requestBooksController.deleteRequestBook)
    .all(methodNotSupported);

router
    .route('/return')
    .delete(
        authenticateMiddleware.admin,
        returnBooksValidator.returnBooksSchema,
        returnBooksController.returnBook
    )
    .all(methodNotSupported);

router
    .route('/:bookId')
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
