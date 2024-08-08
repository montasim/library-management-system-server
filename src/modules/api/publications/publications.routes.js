/**
 * @fileoverview This file defines the routes for managing publications using Express. It includes routes
 * for creating, retrieving, updating, and deleting publications, and applies various middlewares for
 * authentication, validation, caching, and method support.
 */

import express from 'express';

import publicationsController from './publications.controller.js';
import publicationsValidator from './publications.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';

const router = express.Router();

/**
 * @openapi
 * /publications/:
 *   post:
 *     summary: Creates a new publication.
 *     description: This endpoint allows admin users to create new publications. It checks for existing publications with the same name and ensures unique entries.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the publication.
 *               description:
 *                 type: string
 *                 description: Detailed description of the publication.
 *               isActive:
 *                 type: boolean
 *                 description: Status of the publication's activity.
 *     responses:
 *       201:
 *         description: Publication created successfully.
 *       400:
 *         description: Publication with the same name already exists.
 *       401:
 *         description: Unauthorized access.
 *     tags:
 *       - Publications Management
 *   get:
 *     summary: Retrieves a list of publications.
 *     description: This endpoint returns a list of all publications. It supports caching for efficient data retrieval.
 *     responses:
 *       200:
 *         description: A list of publications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publication'
 *       401:
 *         description: Unauthorized access.
 *     tags:
 *       - Publications Management
 *   delete:
 *     summary: Deletes multiple publications.
 *     description: This endpoint allows admin users to delete multiple publications based on a list of IDs.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of publication IDs to delete.
 *     responses:
 *       200:
 *         description: Publications deleted successfully.
 *       400:
 *         description: Invalid publication IDs provided.
 *       401:
 *         description: Unauthorized access.
 *     tags:
 *       - Publications Management
 *   all:
 *     summary: Handles unsupported methods for the base route.
 *     description: Returns an error if an unsupported HTTP method is used on the base route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Publications Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.create
        ),
        publicationsValidator.createPublication,
        publicationsController.createPublication,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .get(
        publicationsValidator.getPublicationList,
        publicationsController.getPublicationList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.deleteByList
        ),
        publicationsValidator.deletePublicationList,
        publicationsController.deletePublicationList,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /publications/{id}:
 *   get:
 *     summary: Retrieves a specific publication by ID.
 *     description: This endpoint returns a single publication based on the ID provided. It supports caching for efficient data retrieval.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication to retrieve.
 *     responses:
 *       200:
 *         description: Detailed information about the publication.
 *       404:
 *         description: Publication not found.
 *       401:
 *         description: Unauthorized access.
 *     tags:
 *       - Publications Management
 *   put:
 *     summary: Updates a specific publication by ID.
 *     description: This endpoint allows admin users to update details of a specific publication by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the publication.
 *               description:
 *                 type: string
 *                 description: Updated description of the publication.
 *               isActive:
 *                 type: boolean
 *                 description: Updated status of the publication's activity.
 *     responses:
 *       200:
 *         description: Publication updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Publication not found.
 *       401:
 *         description: Unauthorized access.
 *     tags:
 *       - Publications Management
 *   delete:
 *     summary: Deletes a specific publication by ID.
 *     description: This endpoint allows admin users to delete a specific publication by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication to delete.
 *     responses:
 *       200:
 *         description: Publication deleted successfully.
 *       404:
 *         description: Publication not found.
 *       401:
 *         description: Unauthorized access.
 *     tags:
 *       - Publications Management
 *   all:
 *     summary: Handles unsupported methods for the ID-specific route.
 *     description: Returns an error if an unsupported HTTP method is used on the ID-specific route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Publications Management
 */
router
    .route(`/:${routesConstants.publications.params}`)
    .get(
        publicationsValidator.getPublicationById,
        publicationsController.getPublicationById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.updateById
        ),
        publicationsValidator.updatePublicationById,
        publicationsController.updatePublicationById,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.deleteById
        ),
        publicationsValidator.deletePublicationById,
        publicationsController.deletePublicationById,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .all(methodNotSupported);

export default router;
