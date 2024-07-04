import express from 'express';

import authRoutes from './auth/auth.routes.js';
import authenticateMiddleware from '../../middleware/authenticate.middleware.js';
import booksRoutes from './books/books.routes.js';
import permissionsRoutes from './permissions/permissions.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import rolesRoutes from './roles/roles.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import writersRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', authenticateMiddleware, booksRoutes);
router.use('/permissions', authenticateMiddleware, permissionsRoutes);
router.use('/publications', authenticateMiddleware, publicationsRoutes);
router.use('/roles', authenticateMiddleware, rolesRoutes);
router.use('/subjects', authenticateMiddleware, subjectsRoutes);
router.use('/writers', authenticateMiddleware, writersRoutes);

export default router;
