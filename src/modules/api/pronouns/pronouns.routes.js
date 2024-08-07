/**
 * @fileoverview This file defines the routes for managing pronouns using Express. It includes routes
 * for creating, retrieving, updating, and deleting pronouns, and applies various middlewares for
 * authentication, validation, caching, and method support.
 */

import express from 'express';

import pronounsValidator from './pronouns.validator.js';
import pronounsController from './pronouns.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.pronouns.permissions.create
        ),
        pronounsValidator.createPronouns,
        pronounsController.createPronouns,
        cacheMiddleware.invalidate(routesConstants.pronouns.routes)
    )
    .get(
        pronounsValidator.getPronounsList,
        pronounsController.getPronounsList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.pronouns.permissions.deleteByList
        ),
        pronounsValidator.deletePronounsList,
        pronounsController.deletePronounsList,
        cacheMiddleware.invalidate(routesConstants.pronouns.routes)
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.pronouns.params}`)
    .get(
        pronounsValidator.getPronounsById,
        pronounsController.getPronounsById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.pronouns.permissions.updateById
        ),
        pronounsValidator.updatePronounsById,
        pronounsController.updatePronounsById,
        cacheMiddleware.invalidate(routesConstants.pronouns.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.pronouns.permissions.deleteById
        ),
        pronounsValidator.deletePronounsById,
        pronounsController.deletePronounsById,
        cacheMiddleware.invalidate(routesConstants.pronouns.routes)
    )
    .all(methodNotSupported);

export default router;
