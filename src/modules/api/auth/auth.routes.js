/**
 * @fileoverview This file sets up the Express router for authentication-related routes.
 * It includes routes for login, logout, requesting a new password, resending verification emails,
 * resetting passwords, signing up, and verifying email addresses. The routes use various middlewares
 * for validation, authentication, and handling unsupported methods.
 */

import express from 'express';

import authValidator from './auth.validator.js';
import authController from './auth.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

/**
 * Authentication Routes - This function configures the Express router with various authentication-related routes.
 *
 * - POST `/login`: Validates the login request and calls the login controller.
 * - GET `/logout`: Authenticates the request and calls the logout controller.
 * - PUT `/request-new-password`: Validates the request for a new password and calls the request new password controller.
 * - GET `/resend-verification/:id`: Validates the request and calls the resend verification controller.
 * - PUT `/reset-password/:token`: Validates the reset password request and calls the reset password controller.
 * - POST `/signup`: Validates the signup request and calls the signup controller.
 * - GET `/verify/:token`: Validates the verification token and calls the verify controller.
 * - All other methods on these routes return a "method not supported" response.
 *
 * @returns {Object} - The configured Express router instance.
 */
router
    .route('/login')
    .post(authValidator.login, authController.login)
    .all(methodNotSupported);

router
    .route('/logout')
    .get(
        authenticateMiddleware(accessTypesConstants.USER),
        authController.logout
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
    .route('/signup')
    .post(authValidator.signup, authController.signup)
    .all(methodNotSupported);

router
    .route('/verify/:token')
    .get(authValidator.verify, authController.verify)
    .all(methodNotSupported);

export default router;
