/**
 * @fileoverview This file defines the Express router for managing user profiles. It includes routes
 * for retrieving a user profile by username and applies a methodNotSupported middleware for unsupported
 * HTTP methods.
 */

import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import userProfileController from './userProfile.controller.js';

const router = express.Router();

router
    .route('/:username')
    .get(userProfileController.getProfile)
    .all(methodNotSupported);

export default router;
