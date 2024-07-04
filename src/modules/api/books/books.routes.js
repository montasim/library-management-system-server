import express from 'express';

import booksValidator from './books.validator.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import booksController from './books.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(
        booksValidator.createBook,
        uploadMiddleware.single('image'),
        booksController.createBook
    )
    .get(booksValidator.getBooks, booksController.getBooks)
    .delete(booksValidator.deleteBooks, booksController.deleteBooks)
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(booksValidator.getBook, booksController.getBook)
    .put(
        booksValidator.updateBook,
        uploadMiddleware.single('image'),
        booksController.updateBook
    )
    .delete(booksValidator.deleteBook, booksController.deleteBook)
    .all(methodNotSupported);

export default router;
