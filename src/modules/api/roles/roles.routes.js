import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import rolesValidator from './roles.validator.js';
import rolesController from './roles.controller.js';

const router = express.Router();

router
    .route('/')
    .post(
        rolesValidator.createRole,
        rolesController.createRole
    )
    .get(
        rolesValidator.getRoles,
        rolesController.getRoles
    )
    .delete(
        rolesValidator.deleteRoles,
        rolesController.deleteRoles
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.roles.params}`)
    .get(
        rolesValidator.getRole,
        rolesController.getRole
    )
    .put(
        rolesValidator.updateRole,
        rolesController.updateRole
    )
    .delete(
        rolesValidator.deleteRole,
        rolesController.deleteRole
    )
    .all(methodNotSupported);

export default router;
