/**
 * @fileoverview This file sets up the Express router for admin-related routes. It includes routes for
 * creating a new admin, verifying an admin, resending verification emails, requesting a new password,
 * resetting passwords, logging in, and logging out. The routes use various middlewares for authentication,
 * validation, and handling unsupported methods.
 */

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
    /**
     * @openapi
     * /:
     *   post:
     *     summary: Creates a new admin.
     *     description: Creates a new administrator account. This endpoint is accessible only to users with admin permissions.
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 description: Email address for the new admin.
     *               password:
     *                 type: string
     *                 description: Password for the new admin account.
     *     responses:
     *       201:
     *         description: Admin created successfully.
     *       409:
     *         description: Email already registered.
     *       403:
     *         description: Email already registered as a user.
     *       400:
     *         description: Invalid email provided.
     *     tags:
     *       - Admin Management
     *   all:
     *     summary: Handles unsupported methods.
     *     description: Returns an error if an unsupported HTTP method is used.
     *     responses:
     *       405:
     *         description: Method not supported.
     *     tags:
     *       - Admin Management
     */
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
    .get(
        adminValidator.resendAdminVerification,
        adminController.resendAdminVerification
    )
    .all(methodNotSupported);

router
    .route('/requestBooks-new-password')
    .put(
        adminValidator.requestNewAdminPassword,
        adminController.requestNewAdminPassword
    )
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
    .get(
        authenticateMiddleware(accessTypesConstants.ADMIN),
        adminController.adminLogout
    )
    .all(methodNotSupported);

export default router;
