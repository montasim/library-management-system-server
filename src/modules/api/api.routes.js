import express from 'express';

import booksRoutes from './books/books.routes.js';
import subjectsRoutes from './subjects/subjects.routes.js';
import writerRoutes from './writers/writers.routes.js';

const router = express.Router();

router.use('/books', booksRoutes);
router.use('/subjects', subjectsRoutes);
router.use('/writers', writerRoutes);

export default router;
