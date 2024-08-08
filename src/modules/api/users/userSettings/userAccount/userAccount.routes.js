/**
 * @fileoverview This file defines the routes for user-related operations, including user activity and security.
 * The routes handle HTTP GET requests to fetch user information for activity and security sections.
 * Unsupported HTTP methods on these routes will return a "Method Not Supported" response.
 */

import express from 'express';

import methodNotSupported from '../../../../../shared/methodNotSupported.js';

const router = express.Router();

router.route('/activity').get(usersController.getUser).all(methodNotSupported);

router.route('/security').get(usersController.getUser).all(methodNotSupported);

export default router;
