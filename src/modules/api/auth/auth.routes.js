import express from 'express';

import authValidator from './auth.validator.js';
import authController from './auth.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import rolesValidator from './roles/roles.validator.js';
import rolesController from './roles/roles.controller.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';
import adminRoutes from '../admin/admin.routes.js';

const router = express.Router();

router.use('/admin', adminRoutes);

router
    .route('/login')
    .post(authValidator.login, authController.login)
    .all(methodNotSupported);

router.route('/logout').get(authController.logout).all(methodNotSupported);

router
    .route('/requestBooks-new-password')
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
