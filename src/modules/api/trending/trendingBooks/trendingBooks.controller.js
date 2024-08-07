/**
 * @fileoverview This file defines the controller functions for managing trending books. These functions
 * handle the retrieval of trending books by interacting with the trendingBooks service. Each function utilizes
 * a shared controller to streamline the handling of the request and response.
 */

import trendingBooksService from './trendingBooks.service.js';
import controller from '../../../../shared/controller.js';

/**
 * trendingBooksController - Object containing the defined controller function for trending books management:
 *
 * - getTrendingBooks: Controller function to handle the retrieval of a list of trending books.
 */
const trendingBooksController = {
    /**
     * getTrendingBooks - Controller function to handle the retrieval of a list of trending books. This function
     * delegates the retrieval logic to the trendingBooks service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the query parameters.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getTrendingBooks: controller.getList(
        trendingBooksService,
        'getTrendingBooks'
    ),
};

export default trendingBooksController;
