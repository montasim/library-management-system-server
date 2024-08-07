/**
 * @fileoverview This file sets up the routes for permissions-related operations in an Express application.
 * It defines the endpoints for creating, retrieving, updating, and deleting permissions,
 * as well as assigning default permissions. The routes include middleware for authentication,
 * validation, and caching to ensure secure and efficient handling of requests.
 */

import express from 'express';

import permissionsValidator from './permissions.validator.js';
import permissionsController from './permissions.controller.js';
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
            routesConstants.permissions.permissions.create
        ),
        permissionsValidator.createPermission,
        permissionsController.createPermission,
        cacheMiddleware.invalidate(routesConstants.permissions.routes)
    )
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.getList
        ),
        permissionsValidator.getPermissionList,
        permissionsController.getPermissionList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.deleteByList
        ),
        permissionsValidator.deletePermissionList,
        permissionsController.deletePermissionList,
        cacheMiddleware.invalidate(routesConstants.permissions.routes)
    )
    .all(methodNotSupported);

router
    .route('/default')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.createDefault
        ),
        permissionsController.createDefaultPermissionList,
        cacheMiddleware.invalidate(routesConstants.permissions.routes)
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.permissions.params}`)
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.getById
        ),
        permissionsValidator.getPermissionById,
        permissionsController.getPermissionById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.updateById
        ),
        permissionsValidator.updatePermissionById,
        permissionsController.updatePermissionById,
        cacheMiddleware.invalidate(routesConstants.permissions.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.deleteById
        ),
        permissionsValidator.deletePermissionById,
        permissionsController.deletePermissionById,
        cacheMiddleware.invalidate(routesConstants.permissions.routes)
    )
    .all(methodNotSupported);

export default router;
