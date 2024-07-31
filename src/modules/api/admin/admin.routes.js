import express from 'express';

import adminValidator from './admin.validator.js';
import adminController from './admin.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import routesConstants from '../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.admin.permissions.create
        ),
        adminValidator.createNewAdmin,
        adminController.createNewAdmin
    )
    // .get(adminValidator.getAdmin, adminController.getAdmin)
    // .delete(adminValidator.deleteAdmin, adminController.deleteAdmin)
    .all(methodNotSupported);

router
    .route('/verify/:token')
    .get(adminValidator.verifyAdmin, adminController.verifyAdmin)
    .all(methodNotSupported);

router
    .route('/resend-verification/:id')
    .get(adminValidator.resendAdminVerification, adminController.resendAdminVerification)
    .all(methodNotSupported);

router
    .route('/requestBooks-new-password')
    .put(adminValidator.requestNewAdminPassword, adminController.requestNewAdminPassword)
    .all(methodNotSupported);

router
    .route('/reset-password/:token')
    .put(adminValidator.resetAdminPassword, adminController.resetAdminPassword)
    .all(methodNotSupported);

// router
//     .route('/admin/:adminId')
//     .get(adminValidator.adminId, adminController.getAdminById)
//     .delete(adminValidator.adminId, adminController.deleteAdminById)
//     .all(methodNotSupported);

router
    .route('/login')
    .post(adminValidator.adminLogin, adminController.adminLogin)
    .all(methodNotSupported);

router
    .route('/logout')
    .get(authenticateMiddleware(accessTypesConstants.ADMIN), adminController.adminLogout)
    .all(methodNotSupported);

export default router;
