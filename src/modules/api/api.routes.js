import express from 'express';

import booksRoutes from './books/books.routes.js';
import publicationsRoutes from './publications/publications.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import writersRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/books', booksRoutes);
router.use('/publications', publicationsRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/writers', writersRoutes);

export default router;
