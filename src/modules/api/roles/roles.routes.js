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
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.roles.permissions.create),
        rolesValidator.createRole,
        cacheMiddleware.invalidate(routesConstants.roles.routes),
        rolesController.createRole
    )
    .get(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.roles.permissions.getList),
        rolesValidator.getRoleList,
        cacheMiddleware.create(configuration.cache.timeout),
        rolesController.getRoleList
    )
    .delete(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.roles.permissions.deleteByList),
        rolesValidator.deleteRoleByList,
        cacheMiddleware.invalidate(routesConstants.roles.routes),
        rolesController.deleteRoleByList
    )
    .all(methodNotSupported);

router
    .route('/default')
    .post(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.roles.permissions.createDefault),
        rolesController.createDefaultRole
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.roles.params}`)
    .get(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.roles.permissions.getById),
        rolesValidator.getRoleById,
        cacheMiddleware.create(configuration.cache.timeout),
        rolesController.getRoleById
    )
    .put(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.roles.permissions.updateById),
        rolesValidator.updateRoleById,
        cacheMiddleware.invalidate(routesConstants.roles.routes),
        rolesController.updateRoleById
    )
    .delete(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.roles.permissions.deleteById),
        rolesValidator.deleteRoleById,
        cacheMiddleware.invalidate(routesConstants.roles.routes),
        rolesController.deleteRoleById
    )
    .all(methodNotSupported);

export default router;
