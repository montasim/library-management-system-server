/**
 * @fileoverview This file defines the routes for managing writer-related operations.
 * The routes handle HTTP requests for creating, retrieving, updating, and deleting writer records.
 * Each route is protected by authentication middleware to ensure that only authorized users can perform certain actions.
 * Additionally, the routes utilize validation, caching, and file upload middleware.
 */

import express from 'express';

import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import writersValidator from './writers.validator.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import writersController from './writers.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.create
        ),
        // TODO: fix validation when using formdata
        // writersValidator.createWriter,
        uploadMiddleware.single('image'),
        writersController.createWriter,
        cacheMiddleware.invalidate('writers')
    )
    .get(
        writersValidator.getWriters,
        writersController.getWriters,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.deleteByList
        ),
        writersValidator.deleteWriters,
        writersController.deleteWriters,
        cacheMiddleware.invalidate('writers')
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.writers.params}`)
    .get(
        writersValidator.getWriter,
        writersController.getWriter,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.updateById
        ),
        writersValidator.updateWriter,
        uploadMiddleware.single('image'),
        writersController.updateWriter,
        cacheMiddleware.invalidate('writers')
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.deleteById
        ),
        writersValidator.deleteWriter,
        writersController.deleteWriter,
        cacheMiddleware.invalidate('writers')
    )
    .all(methodNotSupported);

export default router;
