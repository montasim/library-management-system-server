/**
 * @fileoverview This file defines and exports validation middleware for request books-related operations.
 * These validation functions use Joi schemas to validate the input data for various request books endpoints,
 * ensuring that the incoming data meets the required criteria before processing.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import requestBooksSchema from './requestBooks.schema.js';

/**
 * createRequestBook - Middleware to validate the data for creating a new book request.
 * Ensures that the body of the request contains all the necessary fields and meets the specified criteria.
 *
 * @type {Function}
 */
const createRequestBook = validateWithSchema([
    {
        schema: requestBooksSchema.createRequestBookSchema,
        property: 'body',
    },
]);

/**
 * requestBookId - Middleware to validate the request book ID parameter.
 * Ensures that the params of the request contain a valid request book ID.
 *
 * @type {Function}
 */
const requestBookId = validateWithSchema([
    {
        schema: requestBooksSchema.requestBookIdSchema,
        property: 'params',
    },
]);

/**
 * ownerId - Middleware to validate the owner ID parameter.
 * Ensures that the params of the request contain a valid owner ID.
 *
 * @type {Function}
 */
const ownerId = validateWithSchema([
    {
        schema: requestBooksSchema.ownerIdSchema,
        property: 'params',
    },
]);

/**
 * requestBooksValidator - An object that holds validation middleware for request books-related operations.
 * These middleware functions validate the input data for creating a book request, and validating book and owner IDs.
 *
 * @typedef {Object} RequestBooksValidator
 * @property {Function} createRequestBook - Middleware to validate the data for creating a new book request.
 * @property {Function} requestBookId - Middleware to validate the request book ID parameter.
 * @property {Function} ownerId - Middleware to validate the owner ID parameter.
 */
const requestBooksValidator = {
    createRequestBook,
    requestBookId,
    ownerId,
};

export default requestBooksValidator;
