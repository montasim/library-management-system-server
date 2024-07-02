import asyncErrorHandler from '../utilities/asyncErrorHandler.js';
import customValidationMessage from './customValidationMessage.js';
import httpStatus from '../constant/httpStatus.constants.js';

/**
 * A higher-order function that returns a middleware for validating requests against a given Joi schema.
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against.
 * @param {string} property - The property of the request to validate (e.g., 'body', 'query', 'params').
 * @returns {Function} A middleware function that performs validation.
 */
const validateWithSchema = (schema, property = 'body') => {
    return asyncErrorHandler(async (req, res, next) => {
        const { error } = schema
            .messages(customValidationMessage)
            .validate(req[property]);

        if (error) {
            const errorData = {
                route: req.originalUrl,
                timeStamp: new Date(),
                success: false,
                data: {},
                message: error.details[0].message,
                status: httpStatus.BAD_REQUEST,
            };

            return res.status(errorData.status).send(errorData);
        }

        next();
    });
};

export default validateWithSchema;
