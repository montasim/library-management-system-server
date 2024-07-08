import asyncErrorHandler from '../utilities/asyncErrorHandler.js';
import customValidationMessage from './customValidationMessage.js';
import httpStatus from '../constant/httpStatus.constants.js';

const validateWithSchema = (schemas, options = {}) => {
    return asyncErrorHandler(async (req, res, next) => {
        const defaultOptions = {
            abortEarly: false,
            convert: true,
            messages: customValidationMessage,
            ...options,
        };

        for (const { schema, property } of schemas) {
            const { error, value } = schema.validate(
                req[property],
                defaultOptions
            );

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
        }

        next();
    });
};

export default validateWithSchema;
