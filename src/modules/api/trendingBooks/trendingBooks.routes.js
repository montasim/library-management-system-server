import express from 'express';

import trendingBooksController from './trendingBooks.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(trendingBooksController.getTrendingBooks)
    .all(methodNotSupported);

export default router;
