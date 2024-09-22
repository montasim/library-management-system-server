/**
 * @fileoverview This file defines the main router for handling user-related operations, including book history,
 * recently visited books, requested books, and user settings. The routes are protected by authentication middleware,
 * which ensures that only authenticated users with the appropriate access types can access these routes.
 */

import express from 'express';

import userBooksRoutes from './books/usersBooks.routes.js';
import userSettingsRoutes from './userSettings/userSettings.routes.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';
import usersValidator from './users.validators.js';
import usersController from './users.controller.js';

import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(
        usersValidator.getUsersList,
        usersController.getUsersList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .all(methodNotSupported);

router.use('/books', userBooksRoutes);

router.use(
    '/settings',
    authenticateMiddleware(accessTypesConstants.USER),
    userSettingsRoutes
);

export default router;
