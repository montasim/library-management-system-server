import express from 'express';

import desiredBooksController from './desiredBooks.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(desiredBooksController.getDesiredBooks)
    .all(methodNotSupported);

export default router;
