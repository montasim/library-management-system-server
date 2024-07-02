import Joi from 'joi';

import booksConstants from './books.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';

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
        .min(booksConstants.lengths.WRITER_MIN)
        .max(booksConstants.lengths.WRITER_MAX)
        .messages(customValidationMessage),
    subject: Joi.array().items(Joi.string().trim()).required().messages({
        'array.base': 'Subject must be an array.',
        'array.min': 'At least one subject must be specified.',
    }),
    publication: Joi.string()
        .trim()
        .required()
        .min(booksConstants.lengths.PUBLICATION_MIN)
        .max(booksConstants.lengths.PUBLICATION_MAX)
        .messages(customValidationMessage),
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
    page: Joi.string().min(1).default(1).custom((value, helpers) => parseInt(value)),
    limit: Joi.string().min(1).max(100).default(10).custom((value, helpers) => parseInt(value)),
    sort: Joi.string().trim().default('createdAt'),
    name: Joi.string()
        .trim()
        .min(booksConstants.lengths.NAME_MIN)
        .max(booksConstants.lengths.NAME_MAX),
    bestSeller: Joi.string().valid('1').custom((value, helpers) => parseInt(value)),
    review: Joi.string().custom((value, helpers) => parseFloat(value)).min(0).max(5),
    writer: Joi.string()
        .trim()
        .min(booksConstants.lengths.WRITER_MIN)
        .max(booksConstants.lengths.WRITER_MAX),
    subject: Joi.array().items(Joi.string().trim()).messages({
        'array.base': 'Subject must be an array.',
        'string.empty': 'Each subject must not be empty.',
        'array.min': 'At least one subject must be specified.',
    }),
    publication: Joi.string()
        .trim()
        .min(booksConstants.lengths.PUBLICATION_MIN)
        .max(booksConstants.lengths.PUBLICATION_MAX),
    edition: Joi.string()
        .trim()
        .min(booksConstants.lengths.EDITION_MIN)
        .max(booksConstants.lengths.EDITION_MAX),
    summary: Joi.string()
        .trim()
        .min(booksConstants.lengths.SUMMARY_MIN)
        .max(booksConstants.lengths.SUMMARY_MAX),
    price: Joi.string().custom((value, helpers) => parseFloat(value)),
    stockAvailable: Joi.string().custom((value, helpers) => parseInt(value)).min(0),
    createdBy: Joi.string().trim(),
    updatedBy: Joi.string().trim(),
}).strict().messages(customValidationMessage);

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
