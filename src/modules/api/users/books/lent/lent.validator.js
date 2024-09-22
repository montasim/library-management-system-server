/**
 * @fileoverview This file defines the validator functions for user-lent books operations.
 * The validators ensure that the data provided in the lents conform to the defined Joi schemas.
 * The validation is applied to lent bodies for creating books and parameters for validating book IDs.
 */

import validateWithSchema from '../../../../../shared/validateWithSchema.js';
import lentSchema from './lent.schema.js';

/**
 * Middleware to validate a single lent book ID passed as a parameter.
 *
 * This function uses the `lentSchema.lentBookIdSchema` schema to validate the book ID parameter.
 * It ensures that the book ID provided in the parameters conforms to the required ObjectId format.
 *
 * @function
 * @name lentBookId
 * @param {Object} req - The lent object containing the book ID parameter to be validated.
 * @param {Object} res - The response object used to send back validation errors, if any.
 * @param {Function} next - The next middleware function in the lent-response cycle.
 * @returns {void}
 */
const lentBookId = validateWithSchema([
    {
        schema: lentSchema.lentBookIdSchema,
        property: 'params',
    },
]);

const lentValidator = {
    lentBookId,
};

export default lentValidator;
