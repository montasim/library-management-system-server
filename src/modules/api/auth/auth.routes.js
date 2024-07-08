import express from 'express';

import authValidator from './auth.validator.js';
import authController from './auth.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import permissionsValidator from './permissions/permissions.validator.js';
import permissionsController from './permissions/permissions.controller.js';
import rolesValidator from './roles/roles.validator.js';
import rolesController from './roles/roles.controller.js';

const router = express.Router();

router
    .route('/login')
    .post(authValidator.login, authController.login)
    .all(methodNotSupported);

router.route('/logout').get(authController.logout).all(methodNotSupported);

router
    .route('/permissions')
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
    .route('/permissions/:permissionId')
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

router
    .route('/request-new-password')
    .put(authValidator.requestNewPassword, authController.requestNewPassword)
    .all(methodNotSupported);

router
    .route('/resend-verification/:id')
    .get(authValidator.resendVerification, authController.resendVerification)
    .all(methodNotSupported);

router
    .route('/reset-password/:token')
    .put(authValidator.resetPassword, authController.resetPassword)
    .all(methodNotSupported);

router
    .route('/roles')
    .post(rolesValidator.createRole, rolesController.createRole)
    .get(rolesValidator.getRoles, rolesController.getRoles)
    .delete(rolesValidator.deleteRoles, rolesController.deleteRoles)
    .all(methodNotSupported);

router
    .route('/roles/:roleId')
    .get(rolesValidator.getRole, rolesController.getRole)
    .put(rolesValidator.updateRole, rolesController.updateRole)
    .delete(rolesValidator.deleteRole, rolesController.deleteRole)
    .all(methodNotSupported);

router
    .route('/signup')
    .post(authValidator.signup, authController.signup)
    .all(methodNotSupported);

router
    .route('/verify/:token')
    .get(authValidator.verify, authController.verify)
    .all(methodNotSupported);

export default router;
