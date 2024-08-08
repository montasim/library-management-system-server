/**
 * @fileoverview This file defines the routes for user-requested books operations. The routes include
 * endpoints to retrieve the list of requested books for a user, fetch the details of a specific requested book,
 * and delete a specific requested book. The routes apply validation middleware to ensure request parameters
 * are correctly formatted, and use controller methods to handle the business logic for each operation.
 */

import express from 'express';

import userRequestBooksController from './userRequestBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import userRequestBooksValidator from './userRequestBooks.validator.js';

const router = express.Router();

router
    .route('/')
    .get(userRequestBooksController.getRequestBooks)
    .all(methodNotSupported);

router
    .route('/:requestedBookId')
    .get(
        userRequestBooksValidator.requestBookId,
        userRequestBooksController.getRequestBook
    )
    .delete(
        userRequestBooksValidator.requestBookId,
        userRequestBooksController.deleteRequestBook
    )
    .all(methodNotSupported);

export default router;
