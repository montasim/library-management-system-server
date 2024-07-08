import express from 'express';

import authRoutes from './auth/auth.routes.js';
import booksRoutes from './books/books.routes.js';
import detectRoutes from './detect/detect.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import trendingRoutes from './trending/trending.routes.js';
import usersRoutes from './users/users.routes.js';
import writersRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
router.use('/detect', detectRoutes);
router.use('/publications', publicationsRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/trending', trendingRoutes);
router.use('/users', usersRoutes);
router.use('/writers', writersRoutes);

export default router;
