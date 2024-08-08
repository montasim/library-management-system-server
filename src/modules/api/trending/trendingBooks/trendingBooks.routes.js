/**
 * @fileoverview This file defines the Express router for managing trending books. It includes routes
 * for retrieving a list of trending books and applies a methodNotSupported middleware for unsupported
 * HTTP methods.
 */

import express from 'express';

import trendingBooksController from './trendingBooks.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /trending-books:
 *   get:
 *     summary: Retrieves a list of trending books.
 *     description: Provides a list of books that are currently trending based on user favourites.
 *     responses:
 *       200:
 *         description: A list of trending books successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       404:
 *         description: No trending books found.
 *       500:
 *         description: Server error encountered while retrieving trending books.
 *     tags:
 *       - Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Books
 */
router
    .route('/')
    .get(trendingBooksController.getTrendingBooks)
    .all(methodNotSupported);

export default router;
