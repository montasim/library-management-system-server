/**
 * @fileoverview This file defines various Joi schemas for validating data related to user-requested books.
 * The schemas include base validation for book fields, as well as specific schemas for creating books and
 * validating book IDs. These schemas ensure that data conforms to the required formats, lengths, and patterns,
 * providing a robust validation layer for user-requested book operations.
 */

import Joi from 'joi';

import customValidationMessage from '../../../../shared/customValidationMessage.js';
import validationService from '../../../../service/validation.service.js';
import requestBooksConstants from './userRequestBooks.constants.js';

/**
 * requestBookSchemaBase - Base Joi schema for validating user-requested book-related fields.
 * This schema includes:
 *
 * - name: String (trimmed, minLength, maxLength)
 * - writer: String (trimmed, minLength, maxLength)
 * - subject: String (trimmed, minLength, maxLength)
 * - publication: String (trimmed, minLength, maxLength)
 * - edition: String (trimmed, minLength, maxLength)
 * - summary: String (trimmed, minLength, maxLength)
 * - page: String (custom validation messages)
 * - limit: String (minLength, maxLength, default value, custom parsing to integer)
 * - sort: String (trimmed, default value)
 * - isActive: Boolean
 * - createdBy: ObjectId
 * - updatedBy: ObjectId
 * - createdAt: Date
 * - updatedAt: Date
 *
 * This schema is used as the base for more specific user-requested book schemas.
 */
const requestBookSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            requestBooksConstants.lengths.NAME_MIN,
            requestBooksConstants.lengths.NAME_MAX
        )
        .description(
            "Defines the book's title. It must be unique within the database."
        ),
    writer: validationService
        .createStringField(
            requestBooksConstants.lengths.WRITER_MIN,
            requestBooksConstants.lengths.WRITER_MAX
        )
        .description('The writer name related to the book.'),
    subject: validationService
        .createStringField(
            requestBooksConstants.lengths.SUBJECT_MIN,
            requestBooksConstants.lengths.SUBJECT_MAX
        )
        .description('The subject name related to the book.'),
    publication: validationService
        .createStringField(
            requestBooksConstants.lengths.PUBLICATION_MIN,
            requestBooksConstants.lengths.PUBLICATION_MAX
        )
        .description('The publication name related to the book.'),
    edition: validationService
        .createStringField(
            requestBooksConstants.lengths.EDITION_MIN,
            requestBooksConstants.lengths.EDITION_MAX
        )
        .description(
            'Indicates the edition of the book, which may correspond to updates or revisions.'
        ),
    summary: validationService
        .createStringField(
            requestBooksConstants.lengths.SUMMARY_MIN,
            requestBooksConstants.lengths.SUMMARY_MAX
        )
        .description(
            'A concise description of the book, outlining the main points and features.'
        ),
    page: Joi.string()
        .messages({
            'number.base': 'Page count must be a number.',
            'number.integer': 'Page count must be an integer.',
            'any.required': 'Page count is required.',
            ...customValidationMessage,
        })
        .description('Total number of pages in the book.'),
    limit: Joi.string()
        .min(1)
        .max(100)
        .default(10)
        .custom((value, helpers) => parseInt(value))
        .description(
            'Limit for query results, used in pagination to specify how many items to return.'
        ),
    sort: Joi.string()
        .trim()
        .default('createdAt')
        .description(
            'Sorting parameter for the query results, defaulting to the creation date.'
        ),
    isActive: validationService.booleanField,
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

/**
 * createRequestBookSchema - Joi schema for validating data when creating a requested book.
 * This schema makes the 'name', 'writer', 'subject', 'publication', 'page', 'edition', and 'summary' fields required.
 */
const createRequestBookSchema = requestBookSchemaBase.fork(
    ['name', 'writer', 'subject', 'publication', 'page', 'edition', 'summary'],
    (field) => field.required()
);

/**
 * requestBookIdSchema - Joi schema for validating a single requested book ID passed as a parameter.
 * This schema ensures that the 'requestedBookId' field is a valid ObjectId.
 */
const requestBookIdSchema = Joi.object({
    requestedBookId: validationService.objectIdField.required(),
}).strict();

/**
 * userRequestBooksSchema - Object containing all the defined Joi schemas for user-requested books validation:
 *
 * - createRequestBookSchema: Schema for validating data when creating a requested book.
 * - requestBookIdSchema: Schema for validating a single requested book ID passed as a parameter.
 */
const userRequestBooksSchema = {
    createRequestBookSchema,
    requestBookIdSchema,
};

export default userRequestBooksSchema;
