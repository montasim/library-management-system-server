/**
 * @fileoverview
 * This module defines the Express router for handling HTTP requests related to recently visited books.
 * It includes routes for adding a recently visited book and retrieving the list of recently visited books.
 * The routes use appropriate validators, controllers, and a method not supported handler for unsupported HTTP methods.
 */

import express from 'express';

import recentlyVisitedValidator from './recentlyVisited.validator.js';
import recentlyVisitedController from './recentlyVisited.controller.js';

import methodNotSupported from '../../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /recently-visited-books:
 *   post:
 *     summary: Adds a book to the recently visited list.
 *     description: Adds a new book to the user's list of recently visited books, ensuring it does not exceed 10 books.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *                 description: The ID of the book to add to the recently visited list.
 *     responses:
 *       201:
 *         description: Book added to recently visited list successfully.
 *       401:
 *         description: Unauthorized if the user is not authenticated.
 *       404:
 *         description: Book not found.
 *       400:
 *         description: Invalid book ID or book already in list.
 *     tags:
 *       - Recently Visited Books
 *   get:
 *     summary: Retrieves the list of recently visited books.
 *     description: Returns a list of books that the user has recently visited, populated with detailed information about each book.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of recently visited books.
 *       404:
 *         description: No recently visited books found.
 *       401:
 *         description: Unauthorized if the user is not authenticated.
 *     tags:
 *       - Recently Visited Books
 *   all:
 *     summary: Handles unsupported methods.
 *     description: Returns an error if an unsupported HTTP method is used.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Recently Visited Books
 */
router
    .route('/')
    .get(recentlyVisitedController.get)
    .all(methodNotSupported);

router
    .route('/:bookId')
    .post(recentlyVisitedValidator.add, recentlyVisitedController.add)
    .all(methodNotSupported);

export default router;
