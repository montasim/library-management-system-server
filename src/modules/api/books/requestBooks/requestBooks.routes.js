import express from 'express';

import requestBooksController from './requestBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import requestBooksValidator from './requestBooks.validator.js';
import uploadMiddleware from '../../../../middleware/upload.middleware.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.USER,
            routesConstants.requestBooks.permissions.create
        ),
        uploadMiddleware.single('image'),
        requestBooksValidator.createRequestBook,
        requestBooksController.createRequestBook
    )
    .get(requestBooksController.getRequestBooks)
    .all(methodNotSupported);

router
    .route('/:requestedBookId')
    .get(
        requestBooksValidator.requestBookId,
        requestBooksController.getRequestBookByBookId
    )
    .all(methodNotSupported);

router
    .route('/owner/:ownerId')
    .get(
        requestBooksValidator.ownerId,
        requestBooksController.getRequestedBooksByOwnerId
    )
    .all(methodNotSupported);

export default router;
