/**
 * @fileoverview This file defines the Express router for managing trending subjects. It includes routes
 * for retrieving a list of trending subjects and applies a methodNotSupported middleware for unsupported
 * HTTP methods.
 */

import express from 'express';

import trendingSubjectsController from './trendingSubjects.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /trending-subjects:
 *   get:
 *     summary: Retrieves a list of trending subjects.
 *     description: Provides a list of subjects that are currently trending based on user favourites.
 *     responses:
 *       200:
 *         description: A list of trending subjects successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       404:
 *         description: No trending subjects found.
 *       500:
 *         description: Server error encountered while retrieving trending subjects.
 *     tags:
 *       - Subjects
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Subjects
 */
router
    .route('/')
    .get(trendingSubjectsController.getTrendingSubjects)
    .all(methodNotSupported);

export default router;
