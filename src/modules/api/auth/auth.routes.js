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

const router = express.Router();

router
    .route('/login')
    .post(authValidator.login, authController.login)
    .all(methodNotSupported);

router.route('/logout').get(authController.logout).all(methodNotSupported);

router
    .route(`/${routesConstants.permissions.routes}`)
    .post(
        authenticateMiddleware,
        permissionsValidator.createPermission,
        permissionsController.createPermission
    )
    .get(
        authenticateMiddleware,
        permissionsValidator.getPermissions,
        permissionsController.getPermissions
    )
    .delete(
        authenticateMiddleware,
        permissionsValidator.deletePermissions,
        permissionsController.deletePermissions
    )
    .all(methodNotSupported);

router
    .route(
        `/${routesConstants.permissions.routes}/:${routesConstants.permissions.params}`
    )
    .get(
        authenticateMiddleware,
        permissionsValidator.getPermission,
        permissionsController.getPermission
    )
    .put(
        authenticateMiddleware,
        permissionsValidator.updatePermission,
        permissionsController.updatePermission
    )
    .delete(
        authenticateMiddleware,
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
    .post(
        authenticateMiddleware,
        rolesValidator.createRole,
        rolesController.createRole
    )
    .get(
        authenticateMiddleware,
        rolesValidator.getRoles,
        rolesController.getRoles
    )
    .delete(
        authenticateMiddleware,
        rolesValidator.deleteRoles,
        rolesController.deleteRoles
    )
    .all(methodNotSupported);

router
    .route('/roles/:roleId')
    .get(
        authenticateMiddleware,
        rolesValidator.getRole,
        rolesController.getRole
    )
    .put(
        authenticateMiddleware,
        rolesValidator.updateRole,
        rolesController.updateRole
    )
    .delete(
        authenticateMiddleware,
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
