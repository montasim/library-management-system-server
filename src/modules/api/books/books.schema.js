import Joi from 'joi';

import booksConstants from './books.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import customObjectIdValidator from '../../../shared/customObjectIdValidator.js';

// Define base schema for books
const bookSchemaBase = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .min(booksConstants.lengths.NAME_MIN)
        .max(booksConstants.lengths.NAME_MAX)
        .messages(customValidationMessage),
    bestSeller: Joi.number()
        .integer()
        .valid(1)
        .messages(customValidationMessage),
    image: Joi.string()
        .uri()
        .trim()
        .required()
        .messages(customValidationMessage),
    review: Joi.number()
        .min(0)
        .max(5)
        .required()
        .messages(customValidationMessage),
    writer: Joi.string()
        .trim()
        .required()
        .custom(customObjectIdValidator('writer'))
        .messages({
            'any.custom': 'Invalid writer ID format.',
            ...customValidationMessage,
        }),
    subject: Joi.array()
        .items(Joi.string().trim().custom(customObjectIdValidator('subject')))
        .required()
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        }),
    addSubject: Joi.array()
        .items(
            Joi.string().trim().custom(customObjectIdValidator('addSubject'))
        )
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        }),
    deleteSubject: Joi.array()
        .items(
            Joi.string().trim().custom(customObjectIdValidator('deleteSubject'))
        )
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        }),
    publication: Joi.string()
        .trim()
        .required()
        .custom(customObjectIdValidator('publication'))
        .messages({
            'any.custom': 'Invalid publication ID format.',
            ...customValidationMessage,
        }),
    page: Joi.number().integer().required().messages(customValidationMessage),
    edition: Joi.string()
        .trim()
        .required()
        .min(booksConstants.lengths.EDITION_MIN)
        .max(booksConstants.lengths.EDITION_MAX)
        .messages(customValidationMessage),
    summary: Joi.string()
        .trim()
        .required()
        .min(booksConstants.lengths.SUMMARY_MIN)
        .max(booksConstants.lengths.SUMMARY_MAX)
        .messages(customValidationMessage),
    price: Joi.number()
        .required()
        .precision(2)
        .messages(customValidationMessage),
    stockAvailable: Joi.number()
        .integer()
        .required()
        .min(0)
        .messages(customValidationMessage),
    isActive: Joi.boolean().required().messages(customValidationMessage),
}).strict();

// Schema for creating a book, making specific fields required
const createBookSchema = bookSchemaBase.fork(
    [
        'name',
        'bestSeller',
        'image',
        'review',
        'writer',
        'subject',
        'publication',
        'page',
        'edition',
        'summary',
        'price',
        'stockAvailable',
    ],
    (field) => field.required()
);

// Schema for updating a book
const updateBookSchema = bookSchemaBase
    .fork(Object.keys(bookSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple book IDs
const bookIdsParamSchema = Joi.object({
    ids: Joi.string()
        .custom((value, helpers) => {
            const ids = value.split(',');
            ids.forEach((id) => {
                const { error } = Joi.string().alphanum().validate(id);
                if (error) {
                    throw new Error(`Invalid ID provided.`);
                }
            });
            return value; // Return original value if validation passes
        })
        .required()
        .messages(customValidationMessage),
}).required();

const getBooksQuerySchema = Joi.object({
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
    name: Joi.string()
        .trim()
        .min(booksConstants.lengths.NAME_MIN)
        .max(booksConstants.lengths.NAME_MAX),
    bestSeller: Joi.string()
        .valid('1')
        .custom((value, helpers) => parseInt(value)),
    review: Joi.string()
        .custom((value, helpers) => parseFloat(value))
        .min(0)
        .max(5),
    writer: Joi.string()
        .trim()
        .custom(customObjectIdValidator('writer'))
        .messages({
            'any.custom': 'Invalid writer ID format.',
            ...customValidationMessage,
        }),
    subject: Joi.array()
        .items(Joi.string().trim().custom(customObjectIdValidator('subject')))
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        }),
    publication: Joi.string()
        .trim()
        .custom(customObjectIdValidator('publication'))
        .messages({
            'any.custom': 'Invalid publication ID format.',
            ...customValidationMessage,
        }),
    edition: Joi.string()
        .trim()
        .min(booksConstants.lengths.EDITION_MIN)
        .max(booksConstants.lengths.EDITION_MAX),
    summary: Joi.string()
        .trim()
        .min(booksConstants.lengths.SUMMARY_MIN)
        .max(booksConstants.lengths.SUMMARY_MAX),
    price: Joi.string().custom((value, helpers) => parseFloat(value)),
    stockAvailable: Joi.string()
        .custom((value, helpers) => parseInt(value))
        .min(0),
    isActive: Joi.string()
        .valid('true', 'false', '1', '0')
        .custom((value, helpers) => {
            if (value === 'true' || value === '1') {
                return true;
            } else if (value === 'false' || value === '0') {
                return false;
            }
            return helpers.error('any.invalid');
        })
        .messages({
            'any.only':
                'isActive must be a boolean value represented as true/false or 1/0.',
            ...customValidationMessage,
        }),
    createdBy: Joi.string().trim(),
    updatedBy: Joi.string().trim(),
})
    .strict()
    .messages(customValidationMessage);

// Schema for single book ID validation
const bookIdParamSchema = Joi.object({
    bookId: Joi.string()
        .alphanum()
        .required()
        .messages(customValidationMessage),
}).strict();

const booksSchema = {
    createBookSchema,
    updateBookSchema,
    getBooksQuerySchema,
    bookIdsParamSchema,
    bookIdParamSchema,
};

export default booksSchema;
