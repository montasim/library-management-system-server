import express from 'express';

import favouriteBooksValidator from './favouriteBooks.validator.js';
import favouriteBooksController from './favouriteBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware
    from '../../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .get(authenticateMiddleware, favouriteBooksController.getFavouriteBooks)
    .all(methodNotSupported);

router
    .route('/:favouriteBookId')
    .post(authenticateMiddleware, favouriteBooksValidator.createFavouriteBook, favouriteBooksController.createFavouriteBook)
    .delete(authenticateMiddleware, favouriteBooksValidator.deleteFavouriteBook, favouriteBooksController.deleteFavouriteBook)
    .all(methodNotSupported);

export default router;
