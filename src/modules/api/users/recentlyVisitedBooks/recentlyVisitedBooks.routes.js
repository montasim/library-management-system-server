/**
 * @fileoverview
 * This module defines the Express router for handling HTTP requests related to recently visited books.
 * It includes routes for adding a recently visited book and retrieving the list of recently visited books.
 * The routes use appropriate validators, controllers, and a method not supported handler for unsupported HTTP methods.
 */

import express from 'express';
import recentlyVisitedBooksValidator from './recentlyVisitedBooks.validator.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import recentlyVisitedBooksController from './recentlyVisitedBooks.controller.js';

const router = express.Router();

router
    .route('/')
    .post(recentlyVisitedBooksValidator.add, recentlyVisitedBooksController.add)
    .get(recentlyVisitedBooksController.get)
    .all(methodNotSupported);

export default router;
