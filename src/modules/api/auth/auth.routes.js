import express from 'express';

import authValidator from './auth.validator.js';
import authController from './auth.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/signup')
    .post(authValidator.signup, authController.signup)
    .all(methodNotSupported);

router
    .route('/verify/:token')
    .get(authValidator.verify, authController.verify)
    .all(methodNotSupported);

router
    .route('/resend-verification/:id')
    .get(authValidator.resendVerification, authController.resendVerification)
    .all(methodNotSupported);

router
    .route('/login')
    .post(authValidator.login, authController.login)
    .all(methodNotSupported);

router
    .route('/reset-password')
    .put(authValidator.signup, authController.signup)
    .all(methodNotSupported);

router
    .route('/logout')
    .post(authValidator.signup, authController.signup)
    .all(methodNotSupported);

export default router;
