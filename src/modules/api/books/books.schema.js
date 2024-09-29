/**
 * @fileoverview This file defines and exports Joi validation schemas for managing books.
 * These schemas are used to validate the input data for various book-related operations,
 * including creating, updating, querying, and deleting books. The validation schemas utilize
 * custom validation messages and the validationService for common field validations.
 */

import Joi from 'joi';

import booksConstants from './books.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

/**
 * bookSchemaBase - Base Joi schema for validating common fields used in book-related operations.
 * Ensures that fields such as name, bestSeller, review, writer, subject, publication, page, edition,
 * summary, price, stockAvailable, isActive, createdBy, updatedBy, createdAt, and updatedAt meet the specified criteria.
 */
const bookSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            booksConstants.lengths.NAME_MIN,
            booksConstants.lengths.NAME_MAX
        )
        .description(
            "Defines the book's title. It must be unique within the database."
        ),
    bestSeller: Joi.number()
        .integer()
        .valid(1)
        .messages(customValidationMessage)
        .description(
            'Indicates if the book is a best seller. A value of 1 signifies it is a best seller.'
        ),
    review: Joi.number()
        .min(0)
        .max(5)
        .messages(customValidationMessage)
        .description('A numerical rating for the book, from 0 to 5.'),
    writer: validationService.objectIdField
        .messages({
            'any.custom': 'Invalid writer ID format.',
            ...customValidationMessage,
        })
        .description(
            'The writer ID related to the book. Each ID must be a valid MongoDB ObjectId.'
        ),
    translator: validationService.objectIdField
        .messages({
            'any.custom': 'Invalid translator ID format.',
            ...customValidationMessage,
        })
        .description(
            'The translator ID related to the book. Each ID must be a valid MongoDB ObjectId.'
        ),
    subject: Joi.array()
        .items(validationService.objectIdField)
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        })
        .description(
            'List of subject IDs related to the book. Each ID must be a valid MongoDB ObjectId.'
        ),
    addSubject: Joi.array()
        .items(validationService.objectIdField)
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        })
        .description(
            'List of the subject IDs related to the book that will be added. Each ID must be a valid MongoDB ObjectId.'
        ),
    deleteSubject: Joi.array()
        .items(validationService.objectIdField)
        .messages({
            'any.custom': 'Invalid subject ID format.',
            ...customValidationMessage,
        })
        .description(
            'List of the subject IDs related to the book that will be deleted. Each ID must be a valid MongoDB ObjectId.'
        ),
    publication: validationService.objectIdField
        .messages({
            'any.custom': 'Invalid publication ID format.',
            ...customValidationMessage,
        })
        .description(
            'The publication ID related to the book. Each ID must be a valid MongoDB ObjectId.'
        ),
    summary: validationService
        .createStringField(
            booksConstants.lengths.SUMMARY_MIN,
            booksConstants.lengths.SUMMARY_MAX
        )
        .description(
            'A concise description of the book, outlining the main points and features.'
        ),
    price: Joi.number()
        .precision(2)
        .messages(customValidationMessage)
        .description(
            'The selling price of the book, allowing up to two decimal places.'
        ),
    stockAvailable: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.integer': 'Stock available must be a whole number.',
            'number.min': 'Stock available cannot be negative.',
            ...customValidationMessage,
        })
        .description(
            'The number of copies of the book currently available for sale.'
        ),
    page: Joi.number()
        .integer()
        .messages({
            'number.base': 'Page count must be a number.',
            'number.integer': 'Page count must be an integer.',
            'any.required': 'Page count is required.',
            ...customValidationMessage,
        })
        .description('Total number of pages in the book.'),
    edition: validationService
        .createStringField(
            booksConstants.lengths.EDITION_MIN,
            booksConstants.lengths.EDITION_MAX
        )
        .description(
            'Indicates the edition of the book, which may correspond to updates or revisions.'
        ),
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
 * createBookSchema - Joi schema for validating the data to create a new book.
 * Ensures that the name, writer, subject, publication, page, edition, summary, price, stockAvailable,
 * and isActive fields are required and meet the specified criteria.
 *
 * @function
 */
const createBookSchema = bookSchemaBase.fork(
    [
        'name',
        'writer',
        'subject',
        'publication',
        'page',
        'edition',
        'summary',
        'price',
        'stockAvailable',
        'isActive',
    ],
    (field) => field.required(),
    [
        'bestSeller',
        'review',
        'translator',
    ],
    (field) => field.optional()
);

/**
 * updateBookSchema - Joi schema for validating the data to update an existing book.
 * Ensures that at least one of the specified fields is present and meets the required criteria.
 *
 * @function
 */
const updateBookSchema = bookSchemaBase
    .fork(
        [
            'name',
            'bestSeller',
            'review',
            'writer',
            'translator',
            'addSubject',
            'deleteSubject',
            'publication',
            'page',
            'edition',
            'summary',
            'price',
            'stockAvailable',
            'isActive',
        ],
        (field) => field.optional()
    )
    .min(1);

/**
 * bookIdsParamSchema - Joi schema for validating a list of book IDs.
 * Ensures that the ids field is an array of valid MongoDB ObjectIds.
 *
 * @function
 */
const bookIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField
        .required()
        .description(
            'List of the book ID(s). Each ID(s) must be a valid MongoDB ObjectId.'
        ),
})
    .required()
    .messages(customValidationMessage);

/**
 * getBooksQuerySchema - Joi schema for validating query parameters when retrieving a list of books.
 * Ensures that parameters such as name, bestSeller, review, writer, subject, publication, page,
 * edition, summary, price, stockAvailable, isActive, limit, sort, createdBy, updatedBy, createdAt,
 * and updatedAt are optional and meet the specified criteria.
 *
 * @function
 */
const getBooksQuerySchema = bookSchemaBase.fork(
    [
        'name',
        'bestSeller',
        'review',
        'writer',
        'translator',
        'subject',
        'publication',
        'page',
        'edition',
        'summary',
        'price',
        'stockAvailable',
        'isActive',
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
 * bookIdParamSchema - Joi schema for validating a single book ID.
 * Ensures that the bookId field is a valid MongoDB ObjectId.
 *
 * @function
 */
const bookIdParamSchema = Joi.object({
    bookId: validationService.objectIdField
        .required()
        .description('The book ID. ID must be a valid MongoDB ObjectId.'),
}).strict();

/**
 * booksSchema - An object that holds various Joi validation schemas for book-related operations.
 * These schemas ensure that the input data for book endpoints meet the required criteria.
 *
 * @typedef {Object} BooksSchema
 * @property {Object} createBookSchema - Joi schema for validating the data to create a new book.
 * @property {Object} updateBookSchema - Joi schema for validating the data to update an existing book.
 * @property {Object} getBooksQuerySchema - Joi schema for validating query parameters when retrieving a list of books.
 * @property {Object} bookIdsParamSchema - Joi schema for validating a list of book IDs.
 * @property {Object} bookIdParamSchema - Joi schema for validating a single book ID.
 */
const booksSchema = {
    createBookSchema,
    updateBookSchema,
    getBooksQuerySchema,
    bookIdsParamSchema,
    bookIdParamSchema,
};

export default booksSchema;
