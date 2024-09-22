/**
 * @fileoverview This file defines the main router for handling user-related operations, including book history,
 * recently visited books, requested books, and user settings. The routes are protected by authentication middleware,
 * which ensures that only authenticated users with the appropriate access types can access these routes.
 */

import express from 'express';

import usersBooksHistoryRoutes from '../books/history/history.routes.js';
import recentlyVisitedBooksRoutes from '../books/recentlyVisited/recentlyVisited.routes.js';
import userRequestBooksRoutes from '../books/requested/requested.routes.js';
import userFavouriteBooksRoutes from '../books/favourite/favourite.routes.js';
import userLentBooksRoutes from '../books/lent/lent.routes.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';

import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';

const router = express.Router();

router.use(
    '/history',
    authenticateMiddleware(accessTypesConstants.BOTH),
    usersBooksHistoryRoutes
);
router.use(
    '/recently-visited',
    authenticateMiddleware(accessTypesConstants.USER),
    recentlyVisitedBooksRoutes
);
router.use(
    '/requested',
    authenticateMiddleware(accessTypesConstants.USER),
    userRequestBooksRoutes
);
router.use(
    '/favourite',
    authenticateMiddleware(accessTypesConstants.USER),
    userFavouriteBooksRoutes
);
router.use(
    '/lent',
    authenticateMiddleware(accessTypesConstants.USER),
    userLentBooksRoutes
);

export default router;
