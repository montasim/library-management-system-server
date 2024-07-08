import express from 'express';

import authRoutes from './auth/auth.routes.js';
import booksRoutes from './books/books.routes.js';
import desiredBooksRoutes from './desiredBooks/desiredBooks.routes.js';
import favouriteBooksRoutes from './favouriteBooks/favouriteBooks.routes.js';
import permissionsRoutes from './permissions/permissions.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import rolesRoutes from './roles/roles.routes.js';
import requestBooksRoutes from './requestBooks/requestBooks.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import trendingBooksRoutes from './trendingBooks/trendingBooks.routes.js';
import usersRoutes from './users/users.routes.js';
import writersRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
router.use('/desired-books', desiredBooksRoutes);
router.use('/favourite-books', favouriteBooksRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/publications', publicationsRoutes);
router.use('/roles', rolesRoutes);
router.use('/request-books', requestBooksRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/trending-books', trendingBooksRoutes);
router.use('/users', usersRoutes);
router.use('/writers', writersRoutes);

export default router;
