/**
 * @fileoverview This file defines various Joi schemas for validating user book history-related data.
 * The schemas include base validation for book history fields, as well as specific schemas for querying
 * book histories and validating book IDs. The schemas ensure that data conforms to the required formats,
 * lengths, and patterns, providing a robust validation layer for user book history operations.
 */

import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';

/**
 * permissionSchemaBase - Base Joi schema for validating user book history-related fields.
 * This schema includes:
 *
 * - page: String (minLength, default value, custom parsing to integer)
 * - limit: String (minLength, maxLength, default value, custom parsing to integer)
 * - sort: String (trimmed, default value)
 * - isActive: Boolean
 * - createdBy: ObjectId
 * - updatedBy: ObjectId
 * - createdAt: Date
 * - updatedAt: Date
 *
 * This schema is used as the base for more specific user book history schemas.
 */
const permissionSchemaBase = Joi.object({
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
 * booksQueryParamSchema - Joi schema for validating query parameters when retrieving user book histories.
 * This schema makes all fields optional and uses the base permissions schema for validation.
 */
const booksQueryParamSchema = permissionSchemaBase.fork(
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
 * bookIdParamSchema - Joi schema for validating a single book ID passed as a parameter.
 * This schema ensures that the 'bookId' field is a valid ObjectId.
 */
const bookIdParamSchema = Joi.object({
    bookId: validationService.objectIdField.required(),
}).strict();

/**
 * userBookHistorySchema - Object containing all the defined Joi schemas for user book history validation:
 *
 * - booksQueryParamSchema: Schema for validating query parameters when retrieving user book histories.
 * - bookIdParamSchema: Schema for validating a single book ID passed as a parameter.
 */
const userBookHistorySchema = {
    booksQueryParamSchema,
    bookIdParamSchema,
};

export default userBookHistorySchema;
