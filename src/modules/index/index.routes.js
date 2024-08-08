/**
 * @fileoverview This module defines the main router for the application, which handles various routes for different functionalities.
 * It includes routes for home-related operations, status checks, and testing uncaught exceptions.
 */

import express from 'express';

import homeRoutes from './home/home.routes.js';
import statusRoutes from './status/status.routes.js';
import testUncaughtExceptionRoutes from './testUncaughtException/testUncaughtException.routes.js';

const router = express.Router();

router.use('/', homeRoutes);

router.use('/status', statusRoutes);

router.use('/test-uncaught-exception', testUncaughtExceptionRoutes);

export default router;
