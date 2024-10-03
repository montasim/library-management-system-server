import express from 'express';

import aboutUsController from './aboutUs.controller.js';
import aboutUsValidator from './aboutUs.validator.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';
import cacheMiddleware from '../../../../middleware/cache.middleware.js';
import configuration from '../../../../configuration/configuration.js';

import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /aboutUs:
 *   post:
 *     summary: Creates a new faq.
 *     description: Adds a new faq to the database. This endpoint is accessible only to users with admin permissions.
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
 *                 description: Name of the faq.
 *               description:
 *                 type: string
 *                 description: Description of the faq.
 *     responses:
 *       201:
 *         description: AboutUs created successfully.
 *       400:
 *         description: Bad request if the faq information is incomplete or invalid.
 *     tags:
 *       - AboutUs Management
 *   get:
 *     summary: Retrieves a list of aboutUs.
 *     description: Returns a list of all aboutUs, optionally filtered by various parameters.
 *     responses:
 *       200:
 *         description: A list of aboutUs.
 *       204:
 *         description: No content if there are no aboutUs.
 *     tags:
 *       - AboutUs Management
 *   delete:
 *     summary: Deletes multiple aboutUs.
 *     description: Deletes a list of aboutUs identified by their IDs. This endpoint is accessible only to users with admin permissions.
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
 *                 description: Array of faq IDs to be deleted.
 *     responses:
 *       200:
 *         description: AboutUs deleted successfully.
 *       400:
 *         description: Bad request if the IDs are not provided or invalid.
 *     tags:
 *       - AboutUs Management
 *   all:
 *     summary: Handles unsupported methods for the root aboutUs route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - AboutUs Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.aboutUs.permissions.create
        ),
        aboutUsValidator.createAboutUs,
        aboutUsController.createAboutUs,
        cacheMiddleware.invalidate(routesConstants.aboutUs.routes)
    )
    .get(
        aboutUsValidator.getAboutUs,
        aboutUsController.getAboutUs,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.aboutUs.permissions.deleteByList
        ),
        aboutUsController.deleteAboutUs,
        cacheMiddleware.invalidate(routesConstants.aboutUs.routes)
    )
    .all(methodNotSupported);

export default router;
