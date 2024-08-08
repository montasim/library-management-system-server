/**
 * @fileoverview This file defines the validator functions for user book history operations.
 * The validators ensure that the data provided in the requests conform to the defined Joi schemas.
 * The validation is applied to parameters for querying book histories and validating book IDs.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import userBookHistorySchema from './userBookHistory.schema.js';

/**
 * booksQueryParamSchema - Middleware to validate query parameters for retrieving user book histories.
 * This function uses the `userBookHistorySchema.booksQueryParamSchema` schema to validate the parameters
 * and ensures they conform to the required formats, lengths, and patterns.
 *
 * @function
 * @name booksQueryParamSchema
 * @param {Object} req - The request object containing the parameters to be validated.
 * @param {Object} res - The response object used to send back validation errors, if any.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {void}
 */
const booksQueryParamSchema = validateWithSchema([
    {
        schema: userBookHistorySchema.booksQueryParamSchema,
        property: 'params',
    },
]);

/**
 * bookIdParamSchema - Middleware to validate a single book ID passed as a parameter.
 * This function uses the `userBookHistorySchema.bookIdParamSchema` schema to validate the book ID
 * and ensures it conforms to the required ObjectId format.
 *
 * @function
 * @name bookIdParamSchema
 * @param {Object} req - The request object containing the book ID to be validated.
 * @param {Object} res - The response object used to send back validation errors, if any.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {void}
 */
const bookIdParamSchema = validateWithSchema([
    {
        schema: userBookHistorySchema.bookIdParamSchema,
        property: 'params',
    },
]);

const userBookHistoryValidator = {
    booksQueryParamSchema,
    bookIdParamSchema,
};

export default userBookHistoryValidator;
