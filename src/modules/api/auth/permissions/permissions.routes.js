import express from 'express';

import permissionsController from './permissions.controller.js';
import permissionsValidator from './permissions.validator.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

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
    .route('/:permissionId')
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
