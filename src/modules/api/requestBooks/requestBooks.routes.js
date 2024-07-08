import express from 'express';

import requestBooksController from './requestBooks.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware
    from '../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(authenticateMiddleware, requestBooksController.createRequestBook)
    .get(authenticateMiddleware, requestBooksController.getRequestBooks)
    .all(methodNotSupported);

router
    .route('/:requestedBookId')
    .get(authenticateMiddleware, requestBooksController.getRequestBook)
    .delete(authenticateMiddleware, requestBooksController.deleteRequestBook)
    .all(methodNotSupported);

export default router;
