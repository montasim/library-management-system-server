import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware
    from '../../../../middleware/authenticate.middleware.js';
import lendBooksController from './lendBooks.controller.js';

const router = express.Router();

router
    .route('/')
    .post(authenticateMiddleware, lendBooksController.createLendBook)
    .get(authenticateMiddleware, lendBooksController.getLendBooks)
    .all(methodNotSupported);

export default router;
