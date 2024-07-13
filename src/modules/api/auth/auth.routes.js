import express from 'express';

import authValidator from './auth.validator.js';
import authController from './auth.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import permissionsValidator from './permissions/permissions.validator.js';
import permissionsController from './permissions/permissions.controller.js';
import rolesValidator from './roles/roles.validator.js';
import rolesController from './roles/roles.controller.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';
import adminValidator from './admin/admin.validator.js';
import adminController from './admin/admin.controller.js';

const router = express.Router();

router
    .route('/admin')
    .post(authenticateMiddleware.admin, adminValidator.createAdmin, adminController.createAdmin)
    // .get(adminValidator.getAdmin, adminController.getAdmin)
    // .delete(adminValidator.deleteAdmin, adminController.deleteAdmin)
    .all(methodNotSupported);

router
    .route('/admin/verify/:token')
    .get(adminValidator.verify, adminController.verify)
    .all(methodNotSupported);

router
    .route('/admin/resend-verification/:id')
    .get(adminValidator.resendVerification, adminController.resendVerification)
    .all(methodNotSupported);

router
    .route('/admin/request-new-password')
    .put(adminValidator.requestNewPassword, adminController.requestNewPassword)
    .all(methodNotSupported);

router
    .route('/admin/reset-password/:token')
    .put(adminValidator.resetPassword, adminController.resetPassword)
    .all(methodNotSupported);

// router
//     .route('/admin/:adminId')
//     .get(adminValidator.adminId, adminController.getAdminById)
//     .delete(adminValidator.adminId, adminController.deleteAdminById)
//     .all(methodNotSupported);

router
    .route('/admin/login')
    .post(adminValidator.login, adminController.login)
    .all(methodNotSupported);

router.route('/admin/logout').get(adminController.logout).all(methodNotSupported);

router
    .route('/login')
    .post(authValidator.login, authController.login)
    .all(methodNotSupported);

router.route('/logout').get(authController.logout).all(methodNotSupported);

router
    .route(`/${routesConstants.permissions.routes}`)
    .post(
        authenticateMiddleware.admin,
        permissionsValidator.createPermission,
        permissionsController.createPermission
    )
    .get(
        authenticateMiddleware.admin,
        permissionsValidator.getPermissions,
        permissionsController.getPermissions
    )
    .delete(
        authenticateMiddleware.admin,
        permissionsValidator.deletePermissions,
        permissionsController.deletePermissions
    )
    .all(methodNotSupported);

router
    .route(
        `/${routesConstants.permissions.routes}/:${routesConstants.permissions.params}`
    )
    .get(
        authenticateMiddleware.admin,
        permissionsValidator.getPermission,
        permissionsController.getPermission
    )
    .put(
        authenticateMiddleware.admin,
        permissionsValidator.updatePermission,
        permissionsController.updatePermission
    )
    .delete(
        authenticateMiddleware.admin,
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
    .route(`/${routesConstants.roles.routes}`)
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
    .route(`/${routesConstants.roles.routes}/:${routesConstants.roles.params}`)
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

router
    .route('/signup')
    .post(authValidator.signup, authController.signup)
    .all(methodNotSupported);

router
    .route('/verify/:token')
    .get(authValidator.verify, authController.verify)
    .all(methodNotSupported);

export default router;
