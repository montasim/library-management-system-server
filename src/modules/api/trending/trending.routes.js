import express from 'express';

import trendingBooksRoutes from './trendingBooks/trendingBooks.routes.js';
import routesConstants from '../../../constant/routes.constants.js';

const router = express.Router();

router.use(`/${routesConstants.trendingBooks.routes}`, trendingBooksRoutes);

export default router;
