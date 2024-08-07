/**
 * @fileoverview This file defines the Express router for managing trending books. It includes routes
 * for retrieving a list of trending books and applies a methodNotSupported middleware for unsupported
 * HTTP methods.
 */

import express from 'express';

import trendingBooksController from './trendingBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(trendingBooksController.getTrendingBooks)
    .all(methodNotSupported);

export default router;
