/**
 * @fileoverview This file sets up the Express router for handling detection-related HTTP requests.
 * The router defines the routes and their corresponding handlers, utilizing the detect controller
 * and a method not supported handler for unsupported HTTP methods.
 */

import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import detectController from './detect.controller.js';

const router = express.Router();

/**
 * Route handling detection-related requests.
 * Supports GET requests and uses the detect controller to process them.
 * Responds with method not supported for all other HTTP methods.
 */
router.route('/').get(detectController).all(methodNotSupported);

export default router;
