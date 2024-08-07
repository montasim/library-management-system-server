/**
 * @fileoverview This file defines and exports Joi validation middleware for lending books-related operations.
 * These middlewares validate the input data for creating lend books and retrieving lend books,
 * ensuring that the incoming data meets the required criteria before processing.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './lendBooks.schema.js';

/**
 * createLendBooksSchema - Middleware for validating the body of requests to create lend books.
 * Ensures that the request body meets the specified schema requirements.
 *
 * @function
 */
const createLendBooksSchema = validateWithSchema([
    { schema: favouriteBooksSchema.createLendBooksSchema, property: 'body' },
]);

/**
 * getLendBooksQuerySchema - Middleware for validating the query parameters of requests to retrieve lend books.
 * Ensures that the query parameters meet the specified schema requirements.
 *
 * @function
 */
const getLendBooksQuerySchema = validateWithSchema([
    {
        schema: favouriteBooksSchema.getLendBooksQuerySchema,
        property: 'params',
    },
]);

/**
 * lendBooksValidator - An object that holds Joi validation middleware for lend books-related operations.
 * These middlewares validate the input data for creating lend books and retrieving lend books.
 *
 * @typedef {Object} LendBooksValidator
 * @property {Function} createLendBooksSchema - Middleware for validating the body of requests to create lend books.
 * @property {Function} getLendBooksQuerySchema - Middleware for validating the query parameters of requests to retrieve lend books.
 */
const lendBooksValidator = {
    createLendBooksSchema,
    getLendBooksQuerySchema,
};

export default lendBooksValidator;
