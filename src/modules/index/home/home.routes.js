/**
 * @fileoverview This module defines the router for handling home-related operations.
 * It includes routes for retrieving a list of items from the home service, with caching and method not supported handling.
 */


import express from 'express';

import homeController from './home.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';

const router = express.Router();

router
    .route('/')
    .get(homeController, cacheMiddleware.create(configuration.cache.timeout))
    .all(methodNotSupported);

export default router;
