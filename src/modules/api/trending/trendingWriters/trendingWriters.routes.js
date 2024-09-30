/**
 * @fileoverview This file defines the Express router for managing trending writers. It includes routes
 * for retrieving a list of trending writers and applies a methodNotSupported middleware for unsupported
 * HTTP methods.
 */

import express from 'express';

import trendingWritersController from './trendingWriters.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /trending-writers:
 *   get:
 *     summary: Retrieves a list of trending writers.
 *     description: Provides a list of writers that are currently trending based on user favourites.
 *     responses:
 *       200:
 *         description: A list of trending writers successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Writer'
 *       404:
 *         description: No trending writers found.
 *       500:
 *         description: Server error encountered while retrieving trending writers.
 *     tags:
 *       - Writers
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Writers
 */
router
    .route('/')
    .get(trendingWritersController.getTrendingWriters)
    .all(methodNotSupported);

export default router;
