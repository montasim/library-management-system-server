import express from 'express';

import booksRoutes from './books/books.routes.js';
import permissionsRoutes from './permissions/permissions.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import writersRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/books', booksRoutes);
router.use('/permissions', permissionsRoutes);
router.use('/publications', publicationsRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/writers', writersRoutes);

export default router;
