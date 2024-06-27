import express from 'express';

import booksRoutes from './books/books.routes.js';

const router = express.Router();

router.use('/books', booksRoutes);

export default router;
