/**
 * @fileoverview This file defines the routes for user book history operations. The routes include
 * endpoints to retrieve the book history for a user and to fetch the history of a specific book.
 * The routes apply validation middleware to ensure request parameters are correctly formatted,
 * and use controller methods to handle the business logic for each operation.
 */

import express from 'express';

import userBookHistoryController from './userBookHistory.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import userBookHistoryValidator from './userBookHistory.validator.js';

const router = express.Router();

router
    .route('/')
    .get(
        userBookHistoryValidator.booksQueryParamSchema,
        userBookHistoryController.getBooksHistory
    )
    .all(methodNotSupported);

router
    .route('/:bookId')
    .get(
        userBookHistoryValidator.bookIdParamSchema,
        userBookHistoryController.getBookHistoryByBookId
    )
    .all(methodNotSupported);

export default router;
