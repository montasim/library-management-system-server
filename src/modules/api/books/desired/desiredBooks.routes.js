/**
 * @fileoverview This file sets up the Express router for desired books-related routes.
 * It includes a route for retrieving a list of desired books, using validation middleware
 * and a controller method to handle the request. It also includes a handler for unsupported methods.
 */

import express from 'express';

import desiredBooksValidator from './desiredBooks.validator.js';
import desiredBooksController from './desiredBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * Desired Books Routes - This function configures the Express router with routes for desired books-related operations.
 *
 * - GET `/`: Validates the request and calls the getDesiredBooks controller to retrieve a list of desired books.
 * - All other methods on this route return a "method not supported" response.
 *
 * @returns {Object} - The configured Express router instance.
 */
router
    .route('/')
    .get(
        desiredBooksValidator.getDesiredBooks,
        desiredBooksController.getDesiredBooks
    )
    .all(methodNotSupported);

export default router;
