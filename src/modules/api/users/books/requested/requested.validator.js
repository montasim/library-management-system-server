/**
 * @fileoverview This file defines the validator functions for user-requested books operations.
 * The validators ensure that the data provided in the requests conform to the defined Joi schemas.
 * The validation is applied to request bodies for creating books and parameters for validating book IDs.
 */

import validateWithSchema from '../../../../../shared/validateWithSchema.js';
import requestedSchema from './requested.schema.js';

/**
 * Middleware to validate the request body for creating a requested book.
 *
 * This function uses the `requestedSchema.createRequestBookSchema` schema to validate the request body.
 * It ensures that the book data provided in the body conforms to the required formats, lengths, and patterns.
 *
 * @function
 * @name createRequestBook
 * @param {Object} req - The request object containing the body to be validated.
 * @param {Object} res - The response object used to send back validation errors, if any.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {void}
 */
const createRequestBook = validateWithSchema([
    {
        schema: requestedSchema.createRequestBookSchema,
        property: 'body',
    },
]);

/**
 * Middleware to validate a single requested book ID passed as a parameter.
 *
 * This function uses the `requestedSchema.requestBookIdSchema` schema to validate the book ID parameter.
 * It ensures that the book ID provided in the parameters conforms to the required ObjectId format.
 *
 * @function
 * @name requestBookId
 * @param {Object} req - The request object containing the book ID parameter to be validated.
 * @param {Object} res - The response object used to send back validation errors, if any.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {void}
 */
const requestBookId = validateWithSchema([
    {
        schema: requestedSchema.requestBookIdSchema,
        property: 'params',
    },
]);

const requestedValidator = {
    createRequestBook,
    requestBookId,
};

export default requestedValidator;
