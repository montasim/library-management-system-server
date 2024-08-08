/**
 * @fileoverview This module defines the validation middleware for writer-related operations.
 * It uses Joi schemas to validate request parameters and payloads for creating, retrieving, updating, and deleting writers.
 * The validation middleware ensures that the data conforms to the required formats and constraints before proceeding with the operation.
 */

import validateWithSchema from '../../../shared/validateWithSchema.js';
import writersSchema from './writers.schema.js';

/**
 * Middleware for validating the request body when creating a writer.
 *
 * @constant
 * @type {Function}
 * @memberof module:writersValidator
 * @description This middleware validates the request body against the `createWriterSchema`.
 */
const createWriter = validateWithSchema([
    {
        schema: writersSchema.createWriterSchema,
        property: 'body',
    },
]);

/**
 * Middleware for validating query parameters when retrieving a list of writers.
 *
 * @constant
 * @type {Function}
 * @memberof module:writersValidator
 * @description This middleware validates the query parameters against the `getWritersQuerySchema`.
 */
const getWriters = validateWithSchema([
    {
        schema: writersSchema.getWritersQuerySchema,
        property: 'query',
    },
]);

/**
 * Middleware for validating the request parameters when retrieving a specific writer by ID.
 *
 * @constant
 * @type {Function}
 * @memberof module:writersValidator
 * @description This middleware validates the request parameters against the `writerIdParamSchema`.
 */
const getWriter = validateWithSchema([
    {
        schema: writersSchema.writerIdParamSchema,
        property: 'params',
    },
]);

/**
 * Middleware for validating the request parameters and body when updating a specific writer by ID.
 *
 * @constant
 * @type {Function}
 * @memberof module:writersValidator
 * @description This middleware validates the request parameters against the `writerIdParamSchema` and the request body against the `updateWriterSchema`.
 */
const updateWriter = validateWithSchema([
    {
        schema: writersSchema.writerIdParamSchema,
        property: 'params',
    },
    {
        schema: writersSchema.updateWriterSchema,
        property: 'body',
    },
]);

/**
 * Middleware for validating query parameters when deleting multiple writers.
 *
 * @constant
 * @type {Function}
 * @memberof module:writersValidator
 * @description This middleware validates the query parameters against the `writerIdsParamSchema`.
 */
const deleteWriters = validateWithSchema([
    {
        schema: writersSchema.writerIdsParamSchema,
        property: 'query',
    },
]);

/**
 * Middleware for validating the request parameters when deleting a specific writer by ID.
 *
 * @constant
 * @type {Function}
 * @memberof module:writersValidator
 * @description This middleware validates the request parameters against the `writerIdParamSchema`.
 */
const deleteWriter = validateWithSchema([
    {
        schema: writersSchema.writerIdParamSchema,
        property: 'params',
    },
]);

/**
 * Object containing all the validation middleware for writer-related operations.
 *
 * @constant
 * @type {Object}
 * @property {Function} createWriter - Middleware for validating the request body when creating a writer.
 * @property {Function} getWriters - Middleware for validating query parameters when retrieving a list of writers.
 * @property {Function} getWriter - Middleware for validating the request parameters when retrieving a specific writer by ID.
 * @property {Function} updateWriter - Middleware for validating the request parameters and body when updating a specific writer by ID.
 * @property {Function} deleteWriters - Middleware for validating query parameters when deleting multiple writers.
 * @property {Function} deleteWriter - Middleware for validating the request parameters when deleting a specific writer by ID.
 */
const writersValidator = {
    createWriter,
    getWriters,
    getWriter,
    updateWriter,
    deleteWriters,
    deleteWriter,
};

export default writersValidator;
