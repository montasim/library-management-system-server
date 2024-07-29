import express from 'express';

import permissionsValidator from './permissions.validator.js';
import permissionsController from './permissions.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        permissionsValidator.createPermission,
        permissionsController.createPermission
    )
    .get(
        permissionsValidator.getPermissions,
        permissionsController.getPermissions
    )
    .delete(
        permissionsValidator.deletePermissions,
        permissionsController.deletePermissions
    )
    .all(methodNotSupported);

router
    .route('/default')
    .post(permissionsController.createDefaultPermission)
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.permissions.params}`)
    .get(
        permissionsValidator.getPermission,
        permissionsController.getPermission
    )
    .put(
        permissionsValidator.updatePermission,
        permissionsController.updatePermission
    )
    .delete(
        permissionsValidator.deletePermission,
        permissionsController.deletePermission
    )
    .all(methodNotSupported);

export default router;
