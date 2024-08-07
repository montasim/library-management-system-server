/**
 * @fileoverview This file defines and exports Joi validation middleware for books history-related operations.
 * The validation middleware ensures that the input data for various books history endpoints meet the required criteria before processing.
 * The schemas are imported from booksHistory.schema.js and used with validateWithSchema to create validation middleware.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './booksHistory.schema.js';

/**
 * booksQueryParamSchema - Middleware for validating query parameters when retrieving a list of books history.
 * Ensures that the parameters meet the specified criteria defined in the booksHistorySchema.
 *
 * @function
 */
const booksQueryParamSchema = validateWithSchema([
    {
        schema: favouriteBooksSchema.booksQueryParamSchema,
        property: 'params',
    },
]);

/**
 * bookIdParamSchema - Middleware for validating the book ID parameter.
 * Ensures that the book ID meets the specified criteria defined in the booksHistorySchema.
 *
 * @function
 */
const bookIdParamSchema = validateWithSchema([
    {
        schema: favouriteBooksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

/**
 * booksHistoryValidator - An object that holds validation middleware for books history-related operations.
 * These middleware functions validate the input data for retrieving books history and ensure it meets the required criteria.
 *
 * @typedef {Object} BooksHistoryValidator
 * @property {Function} booksQueryParamSchema - Middleware for validating query parameters when retrieving a list of books history.
 * @property {Function} bookIdParamSchema - Middleware for validating the book ID parameter.
 */
const booksHistoryValidator = {
    booksQueryParamSchema,
    bookIdParamSchema,
};

export default booksHistoryValidator;
