import asyncErrorHandler from '../utilities/asyncErrorHandler.js';

const customMessages = {
    'string.empty': `{#label} cannot be empty`,
    'string.min': `{#label} should have a minimum length of {#limit}`,
    'number.min': `{#label} should be at least {#limit}`,
    'number.max': `{#label} should be no more than {#limit}`,
    'any.required': `{#label} is a required field`,
    'number.base': `{#label} must be a number`,
    'string.uri': `{#label} must be a valid URI`,
    'string.alphanum': `{#label} must be alphanumeric`,
    'number.integer': `{#label} must be an integer`,
    'array.base': `{#label} must be an array`
};

/**
 * A higher-order function that returns a middleware for validating requests against a given Joi schema.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {string} property - The property of the request to validate (e.g., 'body', 'query', 'params').
 * @returns {Function} A middleware function that performs validation.
 */
const validateWithSchema = (schema, property = 'body') => {
    return asyncErrorHandler(async (req, res, next) => {
        const { error } = schema.messages(customMessages).validate(req[property]);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        next();
    });
};

export default validateWithSchema;
