/**
 * @fileoverview This file defines and exports Joi validation schemas for desired books-related queries.
 * The schemas are used to validate query parameters for retrieving a list of desired books,
 * ensuring that the incoming data meets the required criteria before processing.
 */

import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';

/**
 * desiredBooksSchemaBase - Base Joi schema for validating common fields used in desired books-related queries.
 * Ensures that fields such as page, limit, sort, isActive, createdBy, updatedBy, createdAt, and updatedAt meet the specified criteria.
 *
 * @typedef {Object} DesiredBooksSchemaBase
 * @property {string} page - String field representing the page number for pagination. Must be at least 1.
 * @property {string} limit - String field representing the number of items per page for pagination. Must be between 1 and 100.
 * @property {string} sort - String field representing the sorting criteria. Default is 'createdAt'.
 * @property {boolean} isActive - Boolean field indicating if the desired book is active.
 * @property {ObjectId} createdBy - ObjectId field representing the ID of the user who created the desired book entry.
 * @property {ObjectId} updatedBy - ObjectId field representing the ID of the user who last updated the desired book entry.
 * @property {Date} createdAt - Date field representing the creation date of the desired book entry.
 * @property {Date} updatedAt - Date field representing the last update date of the desired book entry.
 */
const desiredBooksSchemaBase = Joi.object({
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
 * getDesiredBooksQuerySchema - Joi schema for validating query parameters when retrieving a list of desired books.
 * Ensures that parameters such as isActive, page, limit, sort, createdBy, updatedBy, createdAt, and updatedAt are optional and meet the specified criteria.
 *
 * @function
 */
const getDesiredBooksQuerySchema = desiredBooksSchemaBase.fork(
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
 * desiredBooksSchema - An object that holds Joi validation schemas for desired books-related queries.
 * These schemas validate the input data for retrieving desired books, ensuring it meets the required criteria.
 *
 * @typedef {Object} DesiredBooksSchema
 * @property {Object} getDesiredBooksQuerySchema - Joi schema for validating query parameters when retrieving a list of desired books.
 */
const desiredBooksSchema = {
    getDesiredBooksQuerySchema,
};

export default desiredBooksSchema;
