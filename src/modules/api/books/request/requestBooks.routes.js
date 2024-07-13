import express from 'express';

import requestBooksController from './requestBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(authenticateMiddleware.user, requestBooksController.createRequestBook)
    .get(authenticateMiddleware.user, requestBooksController.getRequestBooks)
    .all(methodNotSupported);

router
    .route('/:requestedBookId')
    .get(authenticateMiddleware.user, requestBooksController.getRequestBook)
    .delete(authenticateMiddleware.user, requestBooksController.deleteRequestBook)
    .all(methodNotSupported);

export default router;
