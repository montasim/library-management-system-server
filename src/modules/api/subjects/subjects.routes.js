/**
 * @fileoverview This file defines the routes for managing subjects using Express. It includes routes
 * for creating, retrieving, updating, and deleting subjects, and applies various middlewares for
 * authentication, validation, caching, and method support.
 */

import express from 'express';

import subjectsController from './subjects.controller.js';
import subjectsValidator from './subjects.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';

const router = express.Router();

/**
 * @openapi
 * /subjects:
 *   post:
 *     summary: Creates a new subject.
 *     description: Adds a new subject to the database. This endpoint is accessible only to users with admin permissions.
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
 *                 description: Name of the subject.
 *               description:
 *                 type: string
 *                 description: Description of the subject.
 *     responses:
 *       201:
 *         description: Subject created successfully.
 *       400:
 *         description: Bad request if the subject information is incomplete or invalid.
 *     tags:
 *       - Subject Management
 *   get:
 *     summary: Retrieves a list of subjects.
 *     description: Returns a list of all subjects, optionally filtered by various parameters.
 *     responses:
 *       200:
 *         description: A list of subjects.
 *       204:
 *         description: No content if there are no subjects.
 *     tags:
 *       - Subject Management
 *   delete:
 *     summary: Deletes multiple subjects.
 *     description: Deletes a list of subjects identified by their IDs. This endpoint is accessible only to users with admin permissions.
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
 *                 description: Array of subject IDs to be deleted.
 *     responses:
 *       200:
 *         description: Subjects deleted successfully.
 *       400:
 *         description: Bad request if the IDs are not provided or invalid.
 *     tags:
 *       - Subject Management
 *   all:
 *     summary: Handles unsupported methods for the root subjects route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Subject Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.create
        ),
        subjectsValidator.createSubject,
        subjectsController.createSubject,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .get(
        subjectsValidator.getSubjects,
        subjectsController.getSubjects,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.deleteByList
        ),
        subjectsValidator.deleteSubjects,
        subjectsController.deleteSubjects,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /subjects/{subjectId}:
 *   get:
 *     summary: Retrieves a subject by ID.
 *     description: Returns a single subject by its ID.
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to retrieve.
 *     responses:
 *       200:
 *         description: Subject retrieved successfully.
 *       404:
 *         description: Subject not found.
 *     tags:
 *       - Subject Management
 *   put:
 *     summary: Updates a subject by ID.
 *     description: Updates details of an existing subject. This endpoint is accessible only to users with admin permissions.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subject.
 *               description:
 *                 type: string
 *                 description: Description of the subject.
 *     responses:
 *       200:
 *         description: Subject updated successfully.
 *       400:
 *         description: Bad request if the update data is incomplete or invalid.
 *       404:
 *         description: Subject not found.
 *     tags:
 *       - Subject Management
 *   delete:
 *     summary: Deletes a subject by ID.
 *     description: Deletes a single subject by its ID. This endpoint is accessible only to users with admin permissions.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the subject to delete.
 *     responses:
 *       200:
 *         description: Subject deleted successfully.
 *       404:
 *         description: Subject not found.
 *     tags:
 *       - Subject Management
 *   all:
 *     summary: Handles unsupported methods for individual subject route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Subject Management
 */
router
    .route(`/:${routesConstants.subjects.params}`)
    .get(
        subjectsValidator.getSubjectById,
        subjectsController.getSubjectById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.updateById
        ),
        subjectsValidator.updateSubject,
        subjectsController.updateSubject,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.deleteById
        ),
        subjectsValidator.deleteSubject,
        subjectsController.deleteSubject,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .all(methodNotSupported);

export default router;
