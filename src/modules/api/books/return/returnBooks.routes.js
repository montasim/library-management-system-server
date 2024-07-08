import express from 'express';

import methodNotSupported from '../../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import returnBooksController from './returnBooks.controller.js';

const router = express.Router();

router
    .route('/')
    .delete(authenticateMiddleware, returnBooksController.returnBook)
    .all(methodNotSupported);

export default router;
