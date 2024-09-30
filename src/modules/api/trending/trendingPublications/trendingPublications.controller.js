/**
 * @fileoverview This file defines the controller functions for managing trending publications. These functions
 * handle the retrieval of trending publications by interacting with the trendingPublications service. Each function utilizes
 * a shared controller to streamline the handling of the request and response.
 */

import trendingPublicationsService from './trendingPublications.service.js';
import controller from '../../../../shared/controller.js';

/**
 * trendingPublicationsController - Object containing the defined controller function for trending publications management:
 *
 * - getTrendingPublications: Controller function to handle the retrieval of a list of trending publications.
 */
const trendingPublicationsController = {
    /**
     * getTrendingPublications - Controller function to handle the retrieval of a list of trending publications. This function
     * delegates the retrieval logic to the trendingPublications service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the query parameters.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getTrendingPublications: controller.getList(
        trendingPublicationsService,
        'getTrendingPublications'
    ),
};

export default trendingPublicationsController;
