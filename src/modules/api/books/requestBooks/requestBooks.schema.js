/**
 * @fileoverview This file defines and exports Joi validation schemas for request books-related operations.
 * These schemas are used to validate the input data for various request books endpoints, including
 * creating a new book request, validating book IDs, and validating owner IDs.
 * The validation schemas utilize the validationService for common field validations and include custom error messages for specific validation rules.
 */

import Joi from 'joi';

import customValidationMessage from '../../../../shared/customValidationMessage.js';
import validationService from '../../../../service/validation.service.js';
import requestBooksConstants from './requestBooks.constant.js';

/**
 * requestBookSchemaBase - Base Joi schema for validating common fields used in request books-related operations.
 * Ensures that fields such as name, writer, subject, publication, edition, summary, page, limit, sort, isActive, createdBy, updatedBy, createdAt, and updatedAt meet the specified criteria.
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
    subject: Joi.array()
        .items(
            validationService.createStringField(
                requestBooksConstants.lengths.SUBJECT_MIN,
                requestBooksConstants.lengths.SUBJECT_MAX
            )
        )
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        })
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
 * createRequestBookSchema - Joi schema for validating the data to create a new book request.
 * Ensures that the name, writer, subject, publication, page, edition, and summary fields are required and meet the specified criteria.
 *
 * @function
 */
const createRequestBookSchema = requestBookSchemaBase.fork(
    ['name', 'writer', 'subject', 'publication', 'page', 'edition', 'summary'],
    (field) => field.required()
);

/**
 * requestBookIdSchema - Joi schema for validating a single book ID.
 * Ensures that the requestedBookId field is required and meets the specified criteria.
 *
 * @function
 */
const requestBookIdSchema = Joi.object({
    requestedBookId: validationService.objectIdField.required(),
}).strict();

/**
 * ownerIdSchema - Joi schema for validating a single owner ID.
 * Ensures that the ownerId field is required and meets the specified criteria.
 *
 * @function
 */
const ownerIdSchema = Joi.object({
    ownerId: validationService.objectIdField.required(),
}).strict();

/**
 * booksSchema - An object that holds various Joi validation schemas for request books-related operations.
 * These schemas ensure that the input data for request books endpoints meet the required criteria.
 *
 * @typedef {Object} BooksSchema
 * @property {Object} createRequestBookSchema - Joi schema for validating the data to create a new book request.
 * @property {Object} requestBookIdSchema - Joi schema for validating a single book ID.
 * @property {Object} ownerIdSchema - Joi schema for validating a single owner ID.
 */
const booksSchema = {
    createRequestBookSchema,
    requestBookIdSchema,
    ownerIdSchema,
};

export default booksSchema;
