import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import rolesValidator from './roles.validator.js';
import rolesController from './roles.controller.js';

const router = express.Router();

router
    .route('/')
    .post(rolesValidator.createRole, rolesController.createRole)
    .get(rolesValidator.getRoleList, rolesController.getRoleList)
    .delete(rolesValidator.deleteRoleByList, rolesController.deleteRoleByList)
    .all(methodNotSupported);

router
    .route('/default')
    .post(rolesController.createDefaultRole)
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.roles.params}`)
    .get(rolesValidator.getRoleById, rolesController.getRoleById)
    .put(rolesValidator.updateRoleById, rolesController.updateRoleById)
    .delete(rolesValidator.deleteRoleById, rolesController.deleteRoleById)
    .all(methodNotSupported);

export default router;
