import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import favouriteBooksController from './favouriteBooks.controller.js';
import favouriteBooksValidator from './favouriteBooks.validator.js';

const router = express.Router();

router
    .route('/')
    .get(authenticateMiddleware, favouriteBooksController.getFavouriteBooks)
    .all(methodNotSupported);

router
    .route('/:favouriteBookId')
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

export default router;
