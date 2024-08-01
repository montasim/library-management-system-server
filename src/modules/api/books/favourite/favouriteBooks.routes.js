import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import favouriteBooksController from './favouriteBooks.controller.js';
import favouriteBooksValidator from './favouriteBooks.validator.js';
import routesConstants from '../../../../constant/routes.constants.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';

const router = express.Router();

router
    .route('/')
    .get(
        authenticateMiddleware(
            accessTypesConstants.USER,
        ),
        favouriteBooksController.getFavouriteBooks
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.favouriteBooks.params}`)
    .post(
        authenticateMiddleware(
            accessTypesConstants.USER,
        ),
        favouriteBooksValidator.favouriteBookIdParamSchema,
        favouriteBooksController.createFavouriteBook
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.USER,
        ),
        favouriteBooksValidator.favouriteBookIdParamSchema,
        favouriteBooksController.deleteFavouriteBook
    )
    .all(methodNotSupported);

export default router;
