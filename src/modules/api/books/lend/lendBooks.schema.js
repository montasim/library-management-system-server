/**
 * @fileoverview This file defines and exports Joi validation schemas for lend books-related operations.
 * These schemas are used to validate the input data for various lend books endpoints, including
 * creating new lend books records and retrieving a list of lend books.
 * The validation schemas utilize the validationService for common field validations and include custom error messages for specific validation rules.
 */

import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';
import lendBooksConstants from './lendBooks.constant.js';

/**
 * lendBookSchemaBase - Base Joi schema for validating common fields used in lend books-related operations.
 * Ensures that fields such as user, book, from, to, remarks, page, limit, sort, createdBy, updatedBy, createdAt, and updatedAt meet the specified criteria.
 */
const lendBookSchemaBase = Joi.object({
    user: validationService.objectIdField,
    book: validationService.objectIdField,
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

/**
 * createLendBooksSchema - Joi schema for validating the data to create a new lend book record.
 * Ensures that the user, book, from, to, and remarks fields are required and meet the specified criteria.
 *
 * @function
 */
const createLendBooksSchema = lendBookSchemaBase.fork(
    ['user', 'book', 'to', 'remarks'],
    (field) => field.required()
);

/**
 * getLendBooksQuerySchema - Joi schema for validating query parameters when retrieving a list of lend books.
 * Ensures that parameters such as user, book, from, to, remarks, page, limit, sort, createdBy, updatedBy, createdAt, and updatedAt are optional and meet the specified criteria.
 *
 * @function
 */
const getLendBooksQuerySchema = lendBookSchemaBase.fork(
    [
        'user',
        'book',
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

/**
 * booksSchema - An object that holds Joi validation schemas for lend books-related operations.
 * These schemas validate the input data for creating and retrieving lend books records, ensuring it meets the required criteria.
 *
 * @typedef {Object} BooksSchema
 * @property {Object} createLendBooksSchema - Joi schema for validating the data to create a new lend book record.
 * @property {Object} getLendBooksQuerySchema - Joi schema for validating query parameters when retrieving a list of lend books.
 */
const booksSchema = {
    createLendBooksSchema,
    getLendBooksQuerySchema,
};

export default booksSchema;
