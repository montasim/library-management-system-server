/**
 * @fileoverview This module defines the main router for the application, which handles various routes for different functionalities.
 * It includes routes for authentication, book management, detection services, publications, subjects, trending items, user management, writer management, permissions, roles, admin operations, pronouns, and user profiles.
 * The router applies authentication middleware where necessary to protect routes that require user access.
 */

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { join } from 'path';
import fs from 'fs';

import authRoutes from './auth/auth.routes.js';
import booksRoutes from './books/books.routes.js';
import detectRoutes from './detect/detect.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import trendingRoutes from './trending/trending.routes.js';
import usersRoutes from './users/users.routes.js';
import writersRoutes from './writers/writers.routes.js';
import authenticateMiddleware from '../../middleware/authenticate.middleware.js';
import routesConstants from '../../constant/routes.constants.js';
import permissionRoutes from './permissions/permission.routes.js';
import rolesRoutes from './roles/roles.routes.js';
import adminRoutes from './admin/admin.routes.js';
import pronounsRoutes from './pronouns/pronouns.routes.js';
import userProfileRoutes from './userProfile/userProfile.routes.js';
import accessTypesConstants from '../../constant/accessTypes.constants.js';

const router = express.Router();

// Path to the JSDoc documentation
const docsPath = join(process.cwd(), 'src', 'documentation', 'code');

// Read the Swagger JSON from the file system
const swaggerDocument = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

// Serve JSDoc documentation on the /api/v1/code-docs route
router.use('/code-docs', express.static(docsPath));

// API documentation route setup
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Application routes
router.use(`/${routesConstants.admin.routes}`, adminRoutes);
router.use(`/${routesConstants.auth.routes}`, authRoutes);
router.use(`/${routesConstants.books.routes}`, booksRoutes);
router.use(`/${routesConstants.detect.routes}`, detectRoutes);
router.use(`/${routesConstants.pronouns.routes}`, pronounsRoutes);
router.use(`/${routesConstants.permissions.routes}`, permissionRoutes);
router.use(`/${routesConstants.publications.routes}`, publicationsRoutes);
router.use(`/${routesConstants.roles.routes}`, rolesRoutes);
router.use(`/${routesConstants.subjects.routes}`, subjectsRoutes);
router.use(`/${routesConstants.trending.routes}`, trendingRoutes);
router.use(
    `/${routesConstants.user.routes}`,
    authenticateMiddleware(accessTypesConstants.USER),
    usersRoutes
);
router.use(`/${routesConstants.writers.routes}`, writersRoutes);
router.use('/', userProfileRoutes);

export default router;
