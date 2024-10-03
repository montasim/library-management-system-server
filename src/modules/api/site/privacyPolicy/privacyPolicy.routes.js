import express from 'express';

import privacyPolicyController from './privacyPolicy.controller.js';
import privacyPolicyValidator from './privacyPolicy.validator.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import routesConstants from '../../../../constant/routes.constants.js';
import cacheMiddleware from '../../../../middleware/cache.middleware.js';
import configuration from '../../../../configuration/configuration.js';

import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /privacyPolicy:
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
 *         description: PrivacyPolicy created successfully.
 *       400:
 *         description: Bad request if the faq information is incomplete or invalid.
 *     tags:
 *       - PrivacyPolicy Management
 *   get:
 *     summary: Retrieves a list of privacyPolicy.
 *     description: Returns a list of all privacyPolicy, optionally filtered by various parameters.
 *     responses:
 *       200:
 *         description: A list of privacyPolicy.
 *       204:
 *         description: No content if there are no privacyPolicy.
 *     tags:
 *       - PrivacyPolicy Management
 *   delete:
 *     summary: Deletes multiple privacyPolicy.
 *     description: Deletes a list of privacyPolicy identified by their IDs. This endpoint is accessible only to users with admin permissions.
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
 *         description: PrivacyPolicy deleted successfully.
 *       400:
 *         description: Bad request if the IDs are not provided or invalid.
 *     tags:
 *       - PrivacyPolicy Management
 *   all:
 *     summary: Handles unsupported methods for the root privacyPolicy route.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - PrivacyPolicy Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.privacyPolicy.permissions.create
        ),
        privacyPolicyValidator.createPrivacyPolicy,
        privacyPolicyController.createPrivacyPolicy,
        cacheMiddleware.invalidate(routesConstants.privacyPolicy.routes)
    )
    .get(
        privacyPolicyValidator.getPrivacyPolicy,
        privacyPolicyController.getPrivacyPolicy,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.privacyPolicy.permissions.deleteByList
        ),
        privacyPolicyController.deletePrivacyPolicy,
        cacheMiddleware.invalidate(routesConstants.privacyPolicy.routes)
    )
    .all(methodNotSupported);

export default router;
