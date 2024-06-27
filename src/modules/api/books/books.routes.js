import express from 'express';

import booksController from './books.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router.route("/")
    .post(booksController.createBook)
    .get(booksController.getBooks)
    .all(methodNotSupported);

router.route("/:bookId")
    .get(booksController.updateBook)
    .put(booksController.updateBook)
    .delete(booksController.deleteBook)
    .all(methodNotSupported);

export default router;
