/**
 * @fileoverview This file defines the Express router for managing trending publications. It includes routes
 * for retrieving a list of trending publications and applies a methodNotSupported middleware for unsupported
 * HTTP methods.
 */

import express from 'express';

import trendingPublicationsController from './trendingPublications.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /trending-publications:
 *   get:
 *     summary: Retrieves a list of trending publications.
 *     description: Provides a list of publications that are currently trending based on user favourites.
 *     responses:
 *       200:
 *         description: A list of trending publications successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publication'
 *       404:
 *         description: No trending publications found.
 *       500:
 *         description: Server error encountered while retrieving trending publications.
 *     tags:
 *       - Publications
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Publications
 */
router
    .route('/')
    .get(trendingPublicationsController.getTrendingPublications)
    .all(methodNotSupported);

export default router;
