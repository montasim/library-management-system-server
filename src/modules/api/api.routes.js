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

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use(`/${routesConstants.books.routes}`, booksRoutes);
router.use('/detect', detectRoutes);
router.use(
    `/${routesConstants.permissions.routes}`,
    authenticateMiddleware.admin,
    permissionRoutes
);
router.use(`/${routesConstants.publications.routes}`, publicationsRoutes);
router.use(
    `/${routesConstants.roles.routes}`,
    authenticateMiddleware.admin,
    rolesRoutes
);
router.use(`/${routesConstants.subjects.routes}`, subjectsRoutes);
router.use('/trending', trendingRoutes);
router.use('/users', authenticateMiddleware.user, usersRoutes);
router.use(`/${routesConstants.writers.routes}`, writersRoutes);

export default router;
