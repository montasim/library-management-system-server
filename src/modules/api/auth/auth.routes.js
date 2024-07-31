import express from 'express';

import authValidator from './auth.validator.js';
import authController from './auth.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

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
