/**
 * @fileoverview This file defines the routes for managing writer-related operations.
 * The routes handle HTTP requests for creating, retrieving, updating, and deleting writer records.
 * Each route is protected by authentication middleware to ensure that only authorized users can perform certain actions.
 * Additionally, the routes utilize validation, caching, and file upload middleware.
 */

import express from 'express';

import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import writersValidator from './writers.validator.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import writersController from './writers.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

/**
 * @openapi
 * /writers:
 *   post:
 *     summary: Creates a new writer.
 *     description: Allows authorized users to create new writer profiles, which include uploading images.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the writer.
 *               biography:
 *                 type: string
 *                 description: Short biography of the writer.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the writer.
 *     responses:
 *       201:
 *         description: Writer created successfully.
 *       400:
 *         description: Invalid input, object invalid.
 *     tags:
 *       - Writer Management
 *   get:
 *     summary: Retrieves a list of writers.
 *     description: Provides a list of all writers, optionally filtered by query parameters.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to filter by.
 *     responses:
 *       200:
 *         description: A list of writers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Writer'
 *     tags:
 *       - Writer Management
 *   delete:
 *     summary: Deletes multiple writers.
 *     description: Allows authorized users to delete multiple writers based on a list of IDs.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Writers deleted successfully.
 *     tags:
 *       - Writer Management
 *   all:
 *     summary: Handles unsupported methods for writers endpoint.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Writer Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.create
        ),
        // TODO: fix validation when using formdata
        // writersValidator.createWriter,
        uploadMiddleware.single('image'),
        writersController.createWriter,
        cacheMiddleware.invalidate('writers')
    )
    .get(
        writersValidator.getWriters,
        writersController.getWriters,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.deleteByList
        ),
        writersValidator.deleteWriters,
        writersController.deleteWriters,
        cacheMiddleware.invalidate('writers')
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /writers/{id}:
 *   get:
 *     summary: Retrieves a writer by ID.
 *     description: Provides detailed information about a writer identified by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the writer.
 *     responses:
 *       200:
 *         description: Detailed writer information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Writer'
 *     tags:
 *       - Writer Management
 *   put:
 *     summary: Updates a writer.
 *     description: Allows authorized users to update writer information including uploading a new image.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the writer to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the writer.
 *               biography:
 *                 type: string
 *                 description: Short biography of the writer.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file of the writer.
 *     responses:
 *       200:
 *         description: Writer updated successfully.
 *     tags:
 *       - Writer Management
 *   delete:
 *     summary: Deletes a writer.
 *     description: Allows authorized users to delete a writer identified by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the writer to be deleted.
 *     responses:
 *       200:
 *         description: Writer deleted successfully.
 *     tags:
 *       - Writer Management
 *   all:
 *     summary: Handles unsupported methods for individual writer endpoint.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Writer Management
 */
router
    .route(`/:${routesConstants.writers.params}`)
    .get(
        writersValidator.getWriter,
        writersController.getWriter,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.updateById
        ),
        writersValidator.updateWriter,
        uploadMiddleware.single('image'),
        writersController.updateWriter,
        cacheMiddleware.invalidate('writers')
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.writers.permissions.deleteById
        ),
        writersValidator.deleteWriter,
        writersController.deleteWriter,
        cacheMiddleware.invalidate('writers')
    )
    .all(methodNotSupported);

export default router;
