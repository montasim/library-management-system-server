import express from 'express';

import rolesController from './roles.controller.js';
import rolesValidator from './roles.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(rolesValidator.createRole, rolesController.createRole)
    .get(rolesValidator.getRoles, rolesController.getRoles)
    .delete(rolesValidator.deleteRoles, rolesController.deleteRoles)
    .all(methodNotSupported);

router
    .route('/:roleId')
    .get(rolesValidator.getRole, rolesController.getRole)
    .put(rolesValidator.updateRole, rolesController.updateRole)
    .delete(rolesValidator.deleteRole, rolesController.deleteRole)
    .all(methodNotSupported);

export default router;
