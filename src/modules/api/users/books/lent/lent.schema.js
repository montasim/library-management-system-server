/**
 * @fileoverview This file defines various Joi schemas for validating data related to user-lent books.
 * The schemas include base validation for book fields, as well as specific schemas for creating books and
 * validating book IDs. These schemas ensure that data conforms to the required formats, lengths, and patterns,
 * providing a robust validation layer for user-lent book operations.
 */

import Joi from 'joi';

import validationService from '../../../../../service/validation.service.js';

/**
 * lentBookIdSchema - Joi schema for validating a single lent book ID passed as a parameter.
 * This schema ensures that the 'lentBookId' field is a valid ObjectId.
 */
const lentBookIdSchema = Joi.object({
    lentBookId: validationService.objectIdField.required(),
}).strict();

/**
 * lentSchema - Object containing all the defined Joi schemas for user-lent books validation:
 *
 * - createRequestBookSchema: Schema for validating data when creating a lent book.
 * - lentBookIdSchema: Schema for validating a single lent book ID passed as a parameter.
 */
const lentSchema = {
    lentBookIdSchema,
};

export default lentSchema;
