/**
 * @fileoverview This module defines the router for handling status-related operations.
 * It includes routes for retrieving the status of the application and handles unsupported methods.
 */

import express from 'express';

import statusController from './status.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router.route('/').get(statusController).all(methodNotSupported);

export default router;
