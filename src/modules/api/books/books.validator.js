/**
 * @fileoverview This file defines and exports validation middleware for book-related operations.
 * These middleware functions validate the input data for various endpoints related to books,
 * ensuring that the incoming requests meet the specified criteria before proceeding.
 */

import validateWithSchema from '../../../shared/validateWithSchema.js';
import booksSchema from './books.schema.js';

/**
 * createNewBook - Middleware for validating the request body when creating a new book.
 * Ensures that the book data meets the specified criteria.
 */
const createNewBook = validateWithSchema([
    {
        schema: booksSchema.createBookSchema,
        property: 'body',
    },
]);

/**
 * getBookList - Middleware for validating the query parameters when retrieving a list of books.
 * Ensures that the query parameters meet the specified criteria.
 */
const getBookList = validateWithSchema([
    {
        schema: booksSchema.getBooksQuerySchema,
        property: 'query',
    },
]);

/**
 * getBookById - Middleware for validating the request parameters when retrieving a book by its ID.
 * Ensures that the book ID meets the specified criteria.
 */
const getBookById = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

/**
 * updateBookById - Middleware for validating the request parameters and body when updating a book by its ID.
 * Ensures that the book ID and update data meet the specified criteria.
 */
const updateBookById = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
    {
        schema: booksSchema.updateBookSchema,
        property: 'body',
    },
]);

/**
 * deleteBookList - Middleware for validating the query parameters when deleting multiple books.
 * Ensures that the book IDs meet the specified criteria.
 */
const deleteBookList = validateWithSchema([
    {
        schema: booksSchema.bookIdsParamSchema,
        property: 'query',
    },
]);

/**
 * deleteBookById - Middleware for validating the request parameters when deleting a book by its ID.
 * Ensures that the book ID meets the specified criteria.
 */
const deleteBookById = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

/**
 * booksValidator - An object that holds the validation middleware for book-related operations.
 * These middleware functions validate the input data for creating, retrieving, updating, and deleting books,
 * ensuring that the incoming requests meet the specified criteria before proceeding.
 *
 * @typedef {Object} BooksValidator
 * @property {Function} createNewBook - Middleware for validating the request body when creating a new book.
 * @property {Function} getBookList - Middleware for validating the query parameters when retrieving a list of books.
 * @property {Function} getBookById - Middleware for validating the request parameters when retrieving a book by its ID.
 * @property {Function} updateBookById - Middleware for validating the request parameters and body when updating a book by its ID.
 * @property {Function} deleteBookList - Middleware for validating the query parameters when deleting multiple books.
 * @property {Function} deleteBookById - Middleware for validating the request parameters when deleting a book by its ID.
 */
const booksValidator = {
    createNewBook,
    getBookList,
    getBookById,
    updateBookById,
    deleteBookList,
    deleteBookById,
};

export default booksValidator;
