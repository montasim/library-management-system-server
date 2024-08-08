/**
 * @fileoverview This module defines the router for testing uncaught exceptions.
 * It includes a route for triggering a simulated uncaught exception and handles unsupported methods.
 */

import express from 'express';

import testUncaughtExceptionController from './testUncaughtException.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router.route('/').get(testUncaughtExceptionController).all(methodNotSupported);

export default router;
