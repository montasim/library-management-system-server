/**
 * @fileoverview This file defines and exports Joi validation schemas for book return operations.
 * The schemas are used to validate input data for the return books endpoint, ensuring that the
 * data meets the required criteria before processing.
 */

import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';
import returnBookConstants from './returnBooks.constant.js';

/**
 * returnBookSchemaBase - Base Joi schema for validating common fields used in book return operations.
 * Ensures that fields such as user, bookId, and remarks meet the specified criteria.
 */
const returnBookSchemaBase = Joi.object({
    user: validationService.objectIdField,
    bookId: validationService.objectIdField,
    remarks: validationService.createStringField(
        returnBookConstants.lengths.REMARKS_MIN,
        returnBookConstants.lengths.REMARKS_MAX
    ),
}).strict();

/**
 * returnSchema - Joi schema for validating the data required to return a book.
 * Ensures that the user, bookId, and remarks fields are required and meet the specified criteria.
 *
 * @function
 */
const returnSchema = returnBookSchemaBase.fork(
    ['user', 'bookId', 'remarks'],
    (field) => field.required()
);

/**
 * returnBookSchema - An object that holds Joi validation schemas for book return operations.
 * These schemas validate the input data for returning books, ensuring it meets the required criteria.
 *
 * @typedef {Object} ReturnBookSchema
 * @property {Object} returnSchema - Joi schema for validating the data required to return a book.
 */
const returnBookSchema = {
    returnSchema,
};

export default returnBookSchema;
