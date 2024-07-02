import asyncErrorHandler from '../utilities/asyncErrorHandler.js';
import customValidationMessage from './customValidationMessage.js';
import httpStatus from '../constant/httpStatus.constants.js';

/**
 * A higher-order function that returns a middleware for validating requests against a given Joi schema.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {string} property - The property of the request to validate (e.g., 'body', 'query', 'params').
 * @param {Object} [options={}] - Optional Joi validation options.
 * @returns {Function} A middleware function that performs validation.
 */
const validateWithSchema = (schema, property = 'body', options = {}) => {
    return asyncErrorHandler(async (req, res, next) => {
        // Ensure conversion is enabled by default for all validations
        const defaultOptions = {
            abortEarly: false,
            convert: true,
            messages: customValidationMessage,
            ...options,
        };
        const { error, value } = schema.validate(req[property], defaultOptions);

        if (error) {
            const errorData = {
                route: req.originalUrl,
                timeStamp: new Date(),
                success: false,
                data: {},
                message: error.details
                    .map((detail) => detail.message)
                    .join(', '),
                status: httpStatus.BAD_REQUEST,
            };

            return res.status(errorData.status).json(errorData);
        }

        // Replace req[property] with the validated and type-converted value
        req[property] = value;

        next();
    });
};

export default validateWithSchema;
