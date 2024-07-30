import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import rolesValidator from './roles.validator.js';
import rolesController from './roles.controller.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';

const router = express.Router();

router
    .route('/')
    .post(rolesValidator.createRole, cacheMiddleware.invalidate(routesConstants.roles.routes), rolesController.createRole)
    .get(rolesValidator.getRoleList, cacheMiddleware.create(configuration.cache.timeout), rolesController.getRoleList)
    .delete(rolesValidator.deleteRoleByList, cacheMiddleware.invalidate(routesConstants.roles.routes), rolesController.deleteRoleByList)
    .all(methodNotSupported);

router
    .route('/default')
    .post(rolesController.createDefaultRole)
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.roles.params}`)
    .get(rolesValidator.getRoleById, cacheMiddleware.create(configuration.cache.timeout), rolesController.getRoleById)
    .put(rolesValidator.updateRoleById, cacheMiddleware.invalidate(routesConstants.roles.routes), rolesController.updateRoleById)
    .delete(rolesValidator.deleteRoleById, cacheMiddleware.invalidate(routesConstants.roles.routes), rolesController.deleteRoleById)
    .all(methodNotSupported);

export default router;
