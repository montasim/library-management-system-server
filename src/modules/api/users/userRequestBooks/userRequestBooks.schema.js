import Joi from 'joi';

import customValidationMessage from '../../../../shared/customValidationMessage.js';
import validationService from '../../../../service/validation.service.js';
import requestBooksConstants from './userRequestBooks.constants.js';

// Define base schema for books
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

// Schema for creating a book, making specific fields required
const createRequestBookSchema = requestBookSchemaBase.fork(
    ['name', 'writer', 'subject', 'publication', 'page', 'edition', 'summary'],
    (field) => field.required()
);

// Schema for single book ID validation
const requestBookIdSchema = Joi.object({
    requestedBookId: validationService.objectIdField.required(),
}).strict();

const userRequestBooksSchema = {
    createRequestBookSchema,
    requestBookIdSchema,
};

export default userRequestBooksSchema;
