/**
 * @fileoverview This file defines the routes for managing translator-related operations.
 * The routes handle HTTP requests for creating, retrieving, updating, and deleting translator records.
 * Each route is protected by authentication middleware to ensure that only authorized users can perform certain actions.
 * Additionally, the routes utilize validation, caching, and file upload middleware.
 */

import express from 'express';

import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import translatorsValidator from './translators.validator.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import translatorsController from './translators.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

/**
 * @openapi
 * /translators:
 *   post:
 *     summary: Creates a new translator.
 *     description: Allows authorized users to create new translator profiles, which include uploading images.
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
 *                 description: Full name of the translator.
 *               biography:
 *                 type: string
 *                 description: Short biography of the translator.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the translator.
 *     responses:
 *       201:
 *         description: Translator created successfully.
 *       400:
 *         description: Invalid input, object invalid.
 *     tags:
 *       - Translator Management
 *   get:
 *     summary: Retrieves a list of translators.
 *     description: Provides a list of all translators, optionally filtered by query parameters.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to filter by.
 *     responses:
 *       200:
 *         description: A list of translators.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Translator'
 *     tags:
 *       - Translator Management
 *   delete:
 *     summary: Deletes multiple translators.
 *     description: Allows authorized users to delete multiple translators based on a list of IDs.
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
 *         description: Translators deleted successfully.
 *     tags:
 *       - Translator Management
 *   all:
 *     summary: Handles unsupported methods for translators endpoint.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Translator Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.translators.permissions.create
        ),
        // TODO: fix validation when using formdata
        // translatorsValidator.createTranslator,
        uploadMiddleware.single('image'),
        translatorsController.createTranslator,
        cacheMiddleware.invalidate('translators')
    )
    .get(
        translatorsValidator.getTranslators,
        translatorsController.getTranslators,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.translators.permissions.deleteByList
        ),
        translatorsValidator.deleteTranslators,
        translatorsController.deleteTranslators,
        cacheMiddleware.invalidate('translators')
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /translators/{id}:
 *   get:
 *     summary: Retrieves a translator by ID.
 *     description: Provides detailed information about a translator identified by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the translator.
 *     responses:
 *       200:
 *         description: Detailed translator information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Translator'
 *     tags:
 *       - Translator Management
 *   put:
 *     summary: Updates a translator.
 *     description: Allows authorized users to update translator information including uploading a new image.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the translator to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the translator.
 *               biography:
 *                 type: string
 *                 description: Short biography of the translator.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New image file of the translator.
 *     responses:
 *       200:
 *         description: Translator updated successfully.
 *     tags:
 *       - Translator Management
 *   delete:
 *     summary: Deletes a translator.
 *     description: Allows authorized users to delete a translator identified by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the translator to be deleted.
 *     responses:
 *       200:
 *         description: Translator deleted successfully.
 *     tags:
 *       - Translator Management
 *   all:
 *     summary: Handles unsupported methods for individual translator endpoint.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Translator Management
 */
router
    .route(`/:${routesConstants.translators.params}`)
    .get(
        translatorsValidator.getTranslator,
        translatorsController.getTranslator,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.translators.permissions.updateById
        ),
        translatorsValidator.updateTranslator,
        uploadMiddleware.single('image'),
        translatorsController.updateTranslator,
        cacheMiddleware.invalidate('translators')
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.translators.permissions.deleteById
        ),
        translatorsValidator.deleteTranslator,
        translatorsController.deleteTranslator,
        cacheMiddleware.invalidate('translators')
    )
    .all(methodNotSupported);

export default router;
