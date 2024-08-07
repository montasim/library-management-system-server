/**
 * @fileoverview This file defines and exports the validation schemas for book return operations.
 * The main schema, returnBooksSchema, validates the data for returning a book, ensuring that all required fields are present and meet the specified criteria.
 * The validation is performed using the Joi schema and the validateWithSchema utility function.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import returnBookSchema from './returnBooks.schema.js';

/**
 * returnBooksSchema - Validation schema for returning a book.
 * This schema validates the request body to ensure it contains the necessary fields for processing a book return.
 *
 * @constant
 * @type {Function}
 *
 * @example
 * const validation = returnBooksSchema({ body: requestBody });
 * if (validation.error) {
 *     // Handle validation error
 * }
 */
const returnBooksSchema = validateWithSchema([
    { schema: returnBookSchema.returnSchema, property: 'body' },
]);

/**
 * returnBooksValidator - An object that holds the validation schemas for book return operations.
 *
 * @typedef {Object} ReturnBooksValidator
 * @property {Function} returnBooksSchema - Validation schema for returning a book.
 */
const returnBooksValidator = {
    returnBooksSchema,
};

export default returnBooksValidator;
