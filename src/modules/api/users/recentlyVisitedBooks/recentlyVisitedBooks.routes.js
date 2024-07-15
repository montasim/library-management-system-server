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
