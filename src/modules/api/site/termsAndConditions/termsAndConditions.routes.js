import express from 'express';

import termsAndConditionsController from './termsAndConditions.controller.js';
import termsAndConditionsValidator from './termsAndConditions.validator.js';
import accessTypesConstants
    from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';
import cacheMiddleware from '../../../../middleware/cache.middleware.js';
import configuration from '../../../../configuration/configuration.js';

import authenticateMiddleware
    from '../../../../middleware/authenticate.middleware.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /termsAndConditions:
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
 *         description: TermsAndConditions created successfully.
 *       400:
 *         description: Bad request if the faq information is incomplete or invalid.
 *     tags:
 *       - TermsAndConditions Management
 *   get:
 *     summary: Retrieves a list of termsAndConditions.
 *     description: Returns a list of all termsAndConditions, optionally filtered by various parameters.
 *     responses:
 *       200:
 *         description: A list of termsAndConditions.
 *       204:
 *         description: No content if there are no termsAndConditions.
 *     tags:
 *       - TermsAndConditions Management
 *   delete:
 *     summary: Deletes multiple termsAndConditions.
 *     description: Deletes a list of termsAndConditions identified by their IDs. This endpoint is accessible only to users with admin permissions.
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
 *         description: TermsAndConditions deleted successfully.
 *       400:
 *         description: Bad request if the IDs are not provided or invalid.
 *     tags:
 *       - TermsAndConditions Management
 *   all:
 *     summary: Handles unsupported methods for the root termsAndConditions route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - TermsAndConditions Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.termsAndConditions.permissions.create
        ),
        termsAndConditionsValidator.createTermsAndConditions,
        termsAndConditionsController.createTermsAndConditions,
        cacheMiddleware.invalidate(routesConstants.termsAndConditions.routes)
    )
    .get(
        termsAndConditionsValidator.getTermsAndConditions,
        termsAndConditionsController.getTermsAndConditions,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.termsAndConditions.permissions.deleteByList
        ),
        termsAndConditionsController.deleteTermsAndConditions,
        cacheMiddleware.invalidate(routesConstants.termsAndConditions.routes)
    )
    .all(methodNotSupported);

export default router;
