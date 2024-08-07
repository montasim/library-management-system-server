/**
 * @fileoverview This file defines and exports the validator for desired books-related queries.
 * The validator includes a function to validate the query parameters for retrieving a list of desired books,
 * ensuring that the incoming data meets the required criteria before processing.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import desiredBooksSchema from './desiredBooks.schema.js';

/**
 * getDesiredBooks - Validator function for validating the query parameters when retrieving a list of desired books.
 * Utilizes the desiredBooksSchema.getDesiredBooksQuerySchema schema to ensure the query parameters meet the specified criteria.
 *
 * @function
 */
const getDesiredBooks = validateWithSchema([
    {
        schema: desiredBooksSchema.getDesiredBooksQuerySchema,
        property: 'query',
    },
]);

/**
 * desiredBooksValidator - An object that holds the validator functions for desired books-related queries.
 * Includes functions to validate query parameters for retrieving desired books.
 *
 * @typedef {Object} DesiredBooksValidator
 * @property {Function} getDesiredBooks - Validator function for validating the query parameters when retrieving a list of desired books.
 */
const desiredBooksValidator = {
    getDesiredBooks,
};

export default desiredBooksValidator;
