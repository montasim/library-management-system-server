import Joi from 'joi';

import booksConstants from './books.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

// Define base schema for books
const bookSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            booksConstants.lengths.NAME_MIN,
            booksConstants.lengths.NAME_MAX
        ),
    bestSeller: Joi.number()
        .integer()
        .valid(1)
        .messages(customValidationMessage),
    review: Joi.number().min(0).max(5).messages(customValidationMessage),
    writer: validationService.objectIdField
        .messages({
            'any.custom': 'Invalid writer ID format.',
            ...customValidationMessage,
        }),
    subject: Joi.array()
        .items(validationService.objectIdField)
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        }),
    addSubject: Joi.array()
        .items(
            validationService.objectIdField
        )
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        }),
    deleteSubject: Joi.array()
        .items(
            validationService.objectIdField
        )
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        }),
    publication: validationService.objectIdField
        .messages({
            'any.custom': 'Invalid publication ID format.',
            ...customValidationMessage,
        }),
    summary: validationService
        .createStringField(
            booksConstants.lengths.SUMMARY_MIN,
            booksConstants.lengths.SUMMARY_MAX
        ),
    price: Joi.number()
        .precision(2)
        .messages(customValidationMessage),
    stockAvailable: Joi.number()
        .integer()
        .min(0)
        .messages(customValidationMessage),
    page: Joi.number().integer().required().messages(customValidationMessage),
    edition: validationService
        .createStringField(
            booksConstants.lengths.EDITION_MIN,
            booksConstants.lengths.EDITION_MAX
        )
        .messages(customValidationMessage),
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

// Schema for creating a book, making specific fields required
const createBookSchema = bookSchemaBase.fork(
    [
        'name',
        'writer',
        'subject',
        'publication',
        'page',
        'edition',
        'summary',
        'price',
        'stockAvailable',
        'isActive',
    ],
    (field) => field.required()
);

// Schema for updating a book
const updateBookSchema = bookSchemaBase
    .fork([
            'name',
            'bestSeller',
            'review',
            'writer',
            'addSubject',
            'deleteSubject',
            'publication',
            'page',
            'edition',
            'summary',
            'price',
            'stockAvailable',
            'isActive',
        ], (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple book IDs
const bookIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getBooksQuerySchema = bookSchemaBase.fork(
    [
        'name',
        'bestSeller',
        'review',
        'writer',
        'subject',
        'publication',
        'page',
        'edition',
        'summary',
        'price',
        'stockAvailable',
        'isActive',
        'limit',
        'sort',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedBy',
    ],
    (field) => field.optional()
);

// Schema for single book ID validation
const bookIdParamSchema = Joi.object({
    bookId: validationService.objectIdField.required(),
}).strict();

const booksSchema = {
    createBookSchema,
    updateBookSchema,
    getBooksQuerySchema,
    bookIdsParamSchema,
    bookIdParamSchema,
};

export default booksSchema;
