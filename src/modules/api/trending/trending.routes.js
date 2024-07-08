import express from 'express';

import trendingBooksRoutes from './trendingBooks/trendingBooks.routes.js';

const router = express.Router();

router.use('/books', trendingBooksRoutes);

export default router;
