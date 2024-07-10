import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';
import lendBooksConstants from './lendBooks.constant.js';

// Define base schema for permissions
const lendBookSchemaBase = Joi.object({
    user: validationService.objectIdField,
    bookId: validationService.objectIdField,
    from: Joi.string().messages({
        'date.base': '"from" must be a valid date in ISO 8601 format',
        'date.iso': '"from" date must strictly follow ISO 8601 format',
        'any.required': '"from" date is required',
    }),
    to: Joi.string().messages({
        'date.base': '"to" must be a valid date in ISO 8601 format',
        'date.iso': '"to" date must strictly follow ISO 8601 format',
        'date.greater': '"to" date must be greater than "from" date',
        'any.required': '"to" date is required',
    }),
    remarks: validationService.createStringField(
        lendBooksConstants.lengths.REMARKS_MIN,
        lendBooksConstants.lengths.REMARKS_MAX
    ),
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
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

const createLendBooksSchema = lendBookSchemaBase.fork(
    ['user', 'bookId', 'from', 'to', 'remarks'],
    (field) => field.required()
);

const getLendBooksQuerySchema = lendBookSchemaBase.fork(
    [
        'user',
        'bookId',
        'from',
        'to',
        'remarks',
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

const booksSchema = {
    createLendBooksSchema,
    getLendBooksQuerySchema,
};

export default booksSchema;
