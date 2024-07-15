import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import authenticateMiddleware
    from '../../../middleware/authenticate.middleware.js';
import rolesValidator from './roles.validator.js';
import rolesController from './roles.controller.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware.admin,
        rolesValidator.createRole,
        rolesController.createRole
    )
    .get(
        authenticateMiddleware.admin,
        rolesValidator.getRoles,
        rolesController.getRoles
    )
    .delete(
        authenticateMiddleware.admin,
        rolesValidator.deleteRoles,
        rolesController.deleteRoles
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.roles.params}`)
    .get(
        authenticateMiddleware.admin,
        rolesValidator.getRole,
        rolesController.getRole
    )
    .put(
        authenticateMiddleware.admin,
        rolesValidator.updateRole,
        rolesController.updateRole
    )
    .delete(
        authenticateMiddleware.admin,
        rolesValidator.deleteRole,
        rolesController.deleteRole
    )
    .all(methodNotSupported);

export default router;
