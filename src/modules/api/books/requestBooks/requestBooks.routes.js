import express from 'express';

import requestBooksController from './requestBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import requestBooksValidator from './requestBooks.validator.js';
import uploadMiddleware from '../../../../middleware/upload.middleware.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.USER,
        ),
        uploadMiddleware.single('image'),
        requestBooksValidator.createRequestBook,
        requestBooksController.createRequestBook
    )
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
        ),
        requestBooksController.getRequestBooks
    )
    .all(methodNotSupported);

router
    .route('/:requestedBookId')
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
        ),
        requestBooksValidator.requestBookId,
        requestBooksController.getRequestBookByBookId
    )
    .all(methodNotSupported);

router
    .route('/owner/:ownerId')
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
        ),
        requestBooksValidator.ownerId,
        requestBooksController.getRequestedBooksByOwnerId
    )
    .all(methodNotSupported);

export default router;
