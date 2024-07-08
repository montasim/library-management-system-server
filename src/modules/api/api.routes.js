import express from 'express';

import authRoutes from './auth/auth.routes.js';
import booksRoutes from './books/books.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import trendingBooksRoutes from './trendingBooks/trendingBooks.routes.js';
import usersRoutes from './users/users.routes.js';
import writersRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
router.use('/publications', publicationsRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/trending-books', trendingBooksRoutes);
router.use('/users', usersRoutes);
router.use('/writers', writersRoutes);

export default router;
