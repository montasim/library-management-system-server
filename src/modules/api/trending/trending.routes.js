/**
 * @fileoverview This file defines the main router for managing trending books. It sets up the route
 * for trending books and applies the corresponding route handler. The router uses the Express framework
 * to define and organize the routes.
 */

import express from 'express';

import trendingBooksRoutes from './trendingBooks/trendingBooks.routes.js';
import routesConstants from '../../../constant/routes.constants.js';

const router = express.Router();

router.use(`/${routesConstants.trendingBooks.routes}`, trendingBooksRoutes);

export default router;
