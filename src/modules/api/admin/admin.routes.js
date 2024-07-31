import express from 'express';

import adminValidator from './admin.validator.js';
import adminController from './admin.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware,
        adminValidator.createAdmin,
        adminController.createAdmin
    )
    // .get(adminValidator.getAdmin, adminController.getAdmin)
    // .delete(adminValidator.deleteAdmin, adminController.deleteAdmin)
    .all(methodNotSupported);

router
    .route('/verify/:token')
    .get(adminValidator.verify, adminController.verify)
    .all(methodNotSupported);

router
    .route('/resend-verification/:id')
    .get(adminValidator.resendVerification, adminController.resendVerification)
    .all(methodNotSupported);

router
    .route('/requestBooks-new-password')
    .put(adminValidator.requestNewPassword, adminController.requestNewPassword)
    .all(methodNotSupported);

router
    .route('/reset-password/:token')
    .put(adminValidator.resetPassword, adminController.resetPassword)
    .all(methodNotSupported);

// router
//     .route('/admin/:adminId')
//     .get(adminValidator.adminId, adminController.getAdminById)
//     .delete(adminValidator.adminId, adminController.deleteAdminById)
//     .all(methodNotSupported);

router
    .route('/login')
    .post(adminValidator.login, adminController.login)
    .all(methodNotSupported);

router
    .route('/logout')
    .get(authenticateMiddleware, adminController.logout)
    .all(methodNotSupported);

export default router;
