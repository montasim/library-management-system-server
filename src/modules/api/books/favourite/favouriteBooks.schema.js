/**
 * @fileoverview This file defines and exports Joi validation schemas for favourite books-related operations.
 * These schemas are used to validate the input data for various favourite books endpoints, including
 * validating a single book ID parameter. The validation schemas utilize the validationService for
 * common field validations.
 */

import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';

/**
 * favouriteBookIdParamSchema - Joi schema for validating a single book ID parameter.
 * Ensures that the book ID is a valid ObjectId and is required for the operation.
 *
 * @function
 */
const favouriteBookIdParamSchema = Joi.object({
    favouriteBookId: validationService.objectIdField.required(),
}).strict();

/**
 * booksSchema - An object that holds Joi validation schemas for favourite books-related operations.
 * These schemas ensure that the input data for favourite books endpoints meet the required criteria.
 *
 * @typedef {Object} BooksSchema
 * @property {Object} favouriteBookIdParamSchema - Joi schema for validating a single book ID parameter.
 */
const booksSchema = {
    favouriteBookIdParamSchema,
};

export default booksSchema;
