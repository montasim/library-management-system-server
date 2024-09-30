/**
 * @fileoverview This file defines the controller functions for managing trending subjects. These functions
 * handle the retrieval of trending subjects by interacting with the trendingSubjects service. Each function utilizes
 * a shared controller to streamline the handling of the request and response.
 */

import trendingSubjectsService from './trendingSubjects.service.js';
import controller from '../../../../shared/controller.js';

/**
 * trendingSubjectsController - Object containing the defined controller function for trending subjects management:
 *
 * - getTrendingSubjects: Controller function to handle the retrieval of a list of trending subjects.
 */
const trendingSubjectsController = {
    /**
     * getTrendingSubjects - Controller function to handle the retrieval of a list of trending subjects. This function
     * delegates the retrieval logic to the trendingSubjects service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the query parameters.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getTrendingSubjects: controller.getList(
        trendingSubjectsService,
        'getTrendingSubjects'
    ),
};

export default trendingSubjectsController;
