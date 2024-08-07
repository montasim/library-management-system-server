/**
 * @fileoverview This file defines and exports Joi validation schemas for books history-related queries.
 * The schemas are used to validate query parameters and path parameters for retrieving books history.
 * It ensures that the incoming data meets the required criteria before processing.
 */

import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';

/**
 * permissionSchemaBase - Base Joi schema for validating common fields used in permissions and related queries.
 * This schema includes fields commonly used across different validation schemas, such as pagination, sorting,
 * and timestamps for creation and updates. It ensures that these fields meet the specified criteria.
 *
 * @typedef {Object} permissionSchemaBase
 * @property {string} page - The page number for pagination. Must be a string that can be converted to an integer.
 * @property {string} limit - The limit for the number of records per page. Must be a string that can be converted to an integer.
 * @property {string} sort - The field to sort by. Default is 'createdAt'.
 * @property {boolean} isActive - A boolean field to filter active records.
 * @property {ObjectId} createdBy - The ID of the user who created the record.
 * @property {ObjectId} updatedBy - The ID of the user who last updated the record.
 * @property {Date} createdAt - The date when the record was created.
 * @property {Date} updatedAt - The date when the record was last updated.
 */
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

/**
 * booksQueryParamSchema - Joi schema for validating query parameters when retrieving the history of books.
 * Ensures that parameters such as isActive, page, limit, sort, createdBy, updatedBy, createdAt, and updatedAt are optional and meet the specified criteria.
 *
 * @function
 */
const booksQueryParamSchema = permissionSchemaBase.fork(
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

/**
 * bookIdParamSchema - Joi schema for validating the book ID parameter.
 * Ensures that the book ID parameter is a valid ObjectId and is required.
 *
 * @function
 */
const bookIdParamSchema = Joi.object({
    bookId: validationService.objectIdField.required(),
}).strict();

/**
 * booksSchema - An object that holds Joi validation schemas for books history-related queries.
 * These schemas validate the input data for retrieving books history, ensuring it meets the required criteria.
 *
 * @typedef {Object} BooksSchema
 * @property {Object} booksQueryParamSchema - Joi schema for validating query parameters when retrieving the history of books.
 * @property {Object} bookIdParamSchema - Joi schema for validating the book ID parameter.
 */
const booksSchema = {
    booksQueryParamSchema,
    bookIdParamSchema,
};

export default booksSchema;
