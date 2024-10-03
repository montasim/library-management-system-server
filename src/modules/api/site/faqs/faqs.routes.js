import express from 'express';

import faqsValidator from './faqs.validator.js';
import faqsController from './faqs.controller.js';
import routesConstants from '../../../../constant/routes.constants.js';
import accessTypesConstants from '../../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../../middleware/cache.middleware.js';
import configuration from '../../../../configuration/configuration.js';

import authenticateMiddleware from '../../../../middleware/authenticate.middleware.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

/**
 * @openapi
 * /faqs/:
 *   post:
 *     summary: Creates a new faq.
 *     description: Creates a new faq record. This endpoint is accessible only to users with admin faqs.
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
 *                 description: The name of the faq.
 *               description:
 *                 type: string
 *                 description: A brief description of the faq.
 *     responses:
 *       201:
 *         description: Faq created successfully.
 *       400:
 *         description: Invalid input data.
 *     tags:
 *       - Faqs Management
 *   get:
 *     summary: Retrieves a list of faqs.
 *     description: Fetches a list of faqs, optionally filtered by various criteria.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of faqs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *     tags:
 *       - Faqs Management
 *   delete:
 *     summary: Deletes multiple faqs.
 *     description: Deletes a list of faqs based on provided identifiers.
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
 *                 description: Array of faq IDs to delete.
 *     responses:
 *       200:
 *         description: Faqs deleted successfully.
 *       400:
 *         description: Invalid request format.
 *     tags:
 *       - Faqs Management
 *   all:
 *     summary: Handles unsupported methods for the faqs endpoint.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Faqs Management
 */
router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.faqs.permissions.create
        ),
        faqsValidator.createFaq,
        faqsController.createFaq,
        cacheMiddleware.invalidate(routesConstants.permissions.routes)
    )
    .get(
        faqsValidator.getFaqList,
        faqsController.getFaqList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.faqs.permissions.deleteByList
        ),
        faqsValidator.deleteFaqList,
        faqsController.deleteFaqList,
        cacheMiddleware.invalidate(routesConstants.faqs.routes)
    )
    .all(methodNotSupported);

/**
 * @openapi
 * /faqs/{id}:
 *   get:
 *     summary: Retrieves a faq by ID.
 *     description: Fetches details of a specific faq by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the faq.
 *     responses:
 *       200:
 *         description: Faq details retrieved successfully.
 *       404:
 *         description: Faq not found.
 *     tags:
 *       - Faqs Management
 *   put:
 *     summary: Updates a faq by ID.
 *     description: Modifies details of a specific faq using its ID.
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
 *                 description: Updated name of the faq.
 *               description:
 *                 type: string
 *                 description: Updated description of the faq.
 *     responses:
 *       200:
 *         description: Faq updated successfully.
 *       404:
 *         description: Faq not found.
 *     tags:
 *       - Faqs Management
 *   delete:
 *     summary: Deletes a faq by ID.
 *     description: Removes a specific faq using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the faq to delete.
 *     responses:
 *       200:
 *         description: Faq deleted successfully.
 *       404:
 *         description: Faq not found.
 *     tags:
 *       - Faqs Management
 *   all:
 *     summary: Handles unsupported methods for faq ID specific endpoint.
 *     responses:
 *       405:
 *         description: Method not supported.
 *     tags:
 *       - Faqs Management
 */
router
    .route(`/:${routesConstants.faqs.params}`)
    .get(
        faqsValidator.getFaqById,
        faqsController.getFaqById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.faqs.permissions.updateById
        ),
        faqsValidator.updateFaqById,
        faqsController.updateFaqById,
        cacheMiddleware.invalidate(routesConstants.faqs.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.faqs.permissions.deleteById
        ),
        faqsValidator.deleteFaqById,
        faqsController.deleteFaqById,
        cacheMiddleware.invalidate(routesConstants.faqs.routes)
    )
    .all(methodNotSupported);

export default router;
