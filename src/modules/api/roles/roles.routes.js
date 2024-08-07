/**
 * @fileoverview This file defines the routes for managing roles using Express. It includes routes
 * for creating, retrieving, updating, and deleting roles, and applies various middlewares for
 * authentication, validation, caching, and method support.
 */

import express from 'express';

import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import rolesValidator from './roles.validator.js';
import rolesController from './roles.controller.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.roles.permissions.create
        ),
        rolesValidator.createRole,
        rolesController.createRole,
        cacheMiddleware.invalidate(routesConstants.roles.routes)
    )
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.roles.permissions.getList
        ),
        rolesValidator.getRoleList,
        rolesController.getRoleList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.roles.permissions.deleteByList
        ),
        rolesValidator.deleteRoleByList,
        rolesController.deleteRoleByList,
        cacheMiddleware.invalidate(routesConstants.roles.routes)
    )
    .all(methodNotSupported);

router
    .route('/default')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.roles.permissions.createDefault
        ),
        rolesController.createDefaultRole,
        cacheMiddleware.invalidate(routesConstants.roles.routes)
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.roles.params}`)
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.roles.permissions.getById
        ),
        rolesValidator.getRoleById,
        rolesController.getRoleById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.roles.permissions.updateById
        ),
        rolesValidator.updateRoleById,
        rolesController.updateRoleById,
        cacheMiddleware.invalidate(routesConstants.roles.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.roles.permissions.deleteById
        ),
        rolesValidator.deleteRoleById,
        rolesController.deleteRoleById,
        cacheMiddleware.invalidate(routesConstants.roles.routes)
    )
    .all(methodNotSupported);

export default router;
