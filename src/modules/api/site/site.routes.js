/**
 * @fileoverview This module defines the main router for the application, which handles various routes for different functionalities.
 * It includes routes for authentication, book management, detection services, publications, subjects, trending items, user management, writer management, permissions, roles, admin operations, pronouns, and user profiles.
 * The router applies authentication middleware where necessary to protect routes that require user access.
 */

import express from 'express';

import routesConstants from '../../../constant/routes.constants.js';
import aboutUsRoutes from './aboutUs/aboutUs.routes.js';

const router = express.Router();

// site routes
router.use(`/${routesConstants.aboutUs.routes}`, aboutUsRoutes);

export default router;
