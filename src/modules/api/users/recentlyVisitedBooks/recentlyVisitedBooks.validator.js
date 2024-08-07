/**
 * @fileoverview
 * This module defines the validation middleware for operations related to recently visited books.
 * It uses the shared validation utility to apply Joi validation schemas to incoming requests.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import recentlyVisitedBooksSchema from './recentlyVisitedBooks.schema.js';

/**
 * Validation middleware for adding a recently visited book.
 *
 * This middleware validates the request body against the `recentlyVisitedBooksSchema.add` schema.
 * It ensures that the incoming request contains a valid book ID in the correct format.
 *
 * @function
 * @name recentlyVisitedBooksValidator.add
 *
 * @param {Object} request - The request object containing the body to be validated.
 * @param {Object} response - The response object used to send back the appropriate HTTP response in case of validation failure.
 * @param {Function} next - The next middleware function in the stack to be called if validation passes.
 *
 * @returns {void}
 */
const add = validateWithSchema([
    {
        schema: recentlyVisitedBooksSchema.add,
        property: 'body',
    },
]);

const recentlyVisitedBooksValidator = {
    add,
};

export default recentlyVisitedBooksValidator;
