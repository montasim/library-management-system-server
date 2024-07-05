import express from 'express';

import authRoutes from './auth/auth.routes.js';
import booksRoutes from './books/books.routes.js';
import permissionsRoutes from './permissions/permissions.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import rolesRoutes from './roles/roles.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import usersRoutes from './users/users.routes.js';
import writersRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/publications', publicationsRoutes);
router.use('/roles', rolesRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/users', usersRoutes);
router.use('/writers', writersRoutes);

export default router;
