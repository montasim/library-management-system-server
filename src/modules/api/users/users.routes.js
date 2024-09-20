/**
 * @fileoverview This file defines the main router for handling user-related operations, including book history,
 * recently visited books, requested books, and user settings. The routes are protected by authentication middleware,
 * which ensures that only authenticated users with the appropriate access types can access these routes.
 */

import express from 'express';

import usersBooksHistoryRoutes from './userBookHistory/usersBooksHistory.routes.js';
import userRequestBooksRoutes from './userRequestBooks/userRequestBooks.routes.js';
import recentlyVisitedBooksRoutes from './books/recentlyVisited/recentlyVisited.routes.js';
import userSettingsRoutes from './userSettings/userSettings.routes.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import usersValidator from './users.validators.js';
import usersController from './users.controller.js';

const router = express.Router();

router
    .route('/')
    .get(
        usersValidator.getUsersList,
        usersController.getUsersList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .all(methodNotSupported);

router.use(
    '/books/history',
    authenticateMiddleware(accessTypesConstants.BOTH),
    usersBooksHistoryRoutes
);
router.use(
    '/books/recently-visited',
    authenticateMiddleware(accessTypesConstants.USER),
    recentlyVisitedBooksRoutes
);
router.use(
    '/books/requested',
    authenticateMiddleware(accessTypesConstants.USER),
    userRequestBooksRoutes
);
router.use(
    '/settings',
    authenticateMiddleware(accessTypesConstants.USER),
    userSettingsRoutes
);

export default router;
