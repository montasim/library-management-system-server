import express from 'express';

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
router.use(`/${routesConstants.user.routes}`, authenticateMiddleware(accessTypesConstants.USER), usersRoutes);
router.use(`/${routesConstants.writers.routes}`, writersRoutes);
router.use('/', userProfileRoutes);

export default router;
