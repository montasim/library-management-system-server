/**
 * @fileoverview This file defines the controller functions for managing trending writers. These functions
 * handle the retrieval of trending writers by interacting with the trendingWriters service. Each function utilizes
 * a shared controller to streamline the handling of the request and response.
 */

import trendingWritersService from './trendingWriters.service.js';
import controller from '../../../../shared/controller.js';

/**
 * trendingWritersController - Object containing the defined controller function for trending writers management:
 *
 * - getTrendingWriters: Controller function to handle the retrieval of a list of trending writers.
 */
const trendingWritersController = {
    /**
     * getTrendingWriters - Controller function to handle the retrieval of a list of trending writers. This function
     * delegates the retrieval logic to the trendingWriters service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the query parameters.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getTrendingWriters: controller.getList(
        trendingWritersService,
        'getTrendingWriters'
    ),
};

export default trendingWritersController;
