/**
 * @fileoverview This file defines the routes for user log operations, including account logs and security logs.
 * The routes handle HTTP GET requests to fetch various types of user logs for the authenticated user.
 * Unsupported HTTP methods on these routes will return a "Method Not Supported" response.
 */

import express from 'express';

import userLogController from './userLog.controller.js';
import methodNotSupported from '../../../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/account')
    .get(userLogController.getAccountLog)
    .all(methodNotSupported);

router
    .route('/security')
    .get(userLogController.getSecurityLog)
    .all(methodNotSupported);

router
    .route('/security')
    .get(userLogController.getSecurityLog)
    .all(methodNotSupported);

export default router;
