import express from 'express';

import booksController from './books.controller.js';
import booksValidator from './books.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(booksValidator.createBook, booksController.createBook)
    .get(booksValidator.getBooks, booksController.getBooks)
    .delete(booksValidator.deleteBooks, booksController.deleteBooks)
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(booksValidator.getBook, booksController.getBook)
    .put(booksValidator.updateBook, booksController.updateBook)
    .delete(booksValidator.deleteBook, booksController.deleteBook)
    .all(methodNotSupported);

export default router;
