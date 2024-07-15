import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';

// Define base schema for permissions
const permissionSchemaBase = Joi.object({
    page: Joi.string()
        .min(1)
        .default(1)
        .custom((value, helpers) => parseInt(value)),
    limit: Joi.string()
        .min(1)
        .max(100)
        .default(10)
        .custom((value, helpers) => parseInt(value)),
    sort: Joi.string().trim().default('createdAt'),
    isActive: validationService.booleanField,
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

const getDesiredBooksQuerySchema = permissionSchemaBase.fork(
    [
        'isActive',
        'page',
        'limit',
        'sort',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedBy',
    ],
    (field) => field.optional()
);

const desiredBooksSchema = {
    getDesiredBooksQuerySchema,
};

export default desiredBooksSchema;
