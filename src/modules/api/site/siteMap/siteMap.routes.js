import express from 'express';

import siteMapController from './siteMap.controller.js';
import siteMapValidator from './siteMap.validator.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';
import cacheMiddleware from '../../../../middleware/cache.middleware.js';
import configuration from '../../../../configuration/configuration.js';

import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /siteMap:
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
 *         description: SiteMap created successfully.
 *       400:
 *         description: Bad request if the faq information is incomplete or invalid.
 *     tags:
 *       - SiteMap Management
 *   get:
 *     summary: Retrieves a list of siteMap.
 *     description: Returns a list of all siteMap, optionally filtered by various parameters.
 *     responses:
 *       200:
 *         description: A list of siteMap.
 *       204:
 *         description: No content if there are no siteMap.
 *     tags:
 *       - SiteMap Management
 *   delete:
 *     summary: Deletes multiple siteMap.
 *     description: Deletes a list of siteMap identified by their IDs. This endpoint is accessible only to users with admin permissions.
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
 *         description: SiteMap deleted successfully.
 *       400:
 *         description: Bad request if the IDs are not provided or invalid.
 *     tags:
 *       - SiteMap Management
 *   all:
 *     summary: Handles unsupported methods for the root siteMap route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - SiteMap Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.siteMap.permissions.create
        ),
        siteMapValidator.createSiteMap,
        siteMapController.createSiteMap,
        cacheMiddleware.invalidate(routesConstants.siteMap.routes)
    )
    .get(
        siteMapValidator.getSiteMap,
        siteMapController.getSiteMap,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.siteMap.permissions.deleteByList
        ),
        siteMapController.deleteSiteMap,
        cacheMiddleware.invalidate(routesConstants.siteMap.routes)
    )
    .all(methodNotSupported);

export default router;
