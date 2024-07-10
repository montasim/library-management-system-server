import express from 'express';

import booksValidator from './books.validator.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import booksController from './books.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import booksHistoryController from './history/booksHistory.controller.js';
import desiredBooksController from './desired/desiredBooks.controller.js';
import favouriteBooksController from './favourite/favouriteBooks.controller.js';
import favouriteBooksValidator from './favourite/favouriteBooks.validator.js';
import requestBooksController from './request/requestBooks.controller.js';
import lendBooksController from './lend/lendBooks.controller.js';
import returnBooksController from './return/returnBooks.controller.js';
import booksHistoryValidator from './history/booksHistory.validator.js';
import desiredBooksValidator from './desired/desiredBooks.validator.js';
import lendBooksValidator from './lend/lendBooks.validator.js';
import returnBooksValidator from './return/returnBooks.validator.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware,
        booksValidator.createBook,
        uploadMiddleware.single('image'),
        booksController.createBook
    )
    .get(booksValidator.getBooks, booksController.getBooks)
    .delete(
        authenticateMiddleware,
        booksValidator.deleteBooks,
        booksController.deleteBooks
    )
    .all(methodNotSupported);

router
    .route('/desired')
    .get(
        desiredBooksValidator.getDesiredBooks,
        desiredBooksController.getDesiredBooks
    )
    .all(methodNotSupported);

router
    .route('/favourite')
    .get(authenticateMiddleware, favouriteBooksController.getFavouriteBooks)
    .all(methodNotSupported);

router
    .route('/favourite/:favouriteBookId')
    .post(
        authenticateMiddleware,
        favouriteBooksValidator.favouriteBookIdParamSchema,
        favouriteBooksController.createFavouriteBook
    )
    .delete(
        authenticateMiddleware,
        favouriteBooksValidator.favouriteBookIdParamSchema,
        favouriteBooksController.deleteFavouriteBook
    )
    .all(methodNotSupported);

router
    .route('/history')
    .get(
        authenticateMiddleware,
        booksHistoryValidator.booksQueryParamSchema,
        booksHistoryController.getBooksHistory
    )
    .all(methodNotSupported);

router
    .route('/history/:bookId')
    .get(
        authenticateMiddleware,
        booksHistoryValidator.bookIdParamSchema,
        booksHistoryController.getBookHistory
    )
    .all(methodNotSupported);

router
    .route('/lend')
    .post(
        authenticateMiddleware,
        lendBooksValidator.createLendBooksSchema,
        lendBooksController.createLendBook
    )
    .get(
        authenticateMiddleware,
        lendBooksValidator.getLendBooksQuerySchema,
        lendBooksController.getLendBooks
    )
    .all(methodNotSupported);

router
    .route('/request')
    .post(authenticateMiddleware, requestBooksController.createRequestBook)
    .get(authenticateMiddleware, requestBooksController.getRequestBooks)
    .all(methodNotSupported);

router
    .route('/request/:requestedBookId')
    .get(authenticateMiddleware, requestBooksController.getRequestBook)
    .delete(authenticateMiddleware, requestBooksController.deleteRequestBook)
    .all(methodNotSupported);

router
    .route('/return')
    .delete(
        authenticateMiddleware,
        returnBooksValidator.returnBooksSchema,
        returnBooksController.returnBook
    )
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(booksValidator.getBook, booksController.getBook)
    .put(
        authenticateMiddleware,
        booksValidator.updateBook,
        uploadMiddleware.single('image'),
        booksController.updateBook
    )
    .delete(
        authenticateMiddleware,
        booksValidator.deleteBook,
        booksController.deleteBook
    )
    .all(methodNotSupported);

export default router;
