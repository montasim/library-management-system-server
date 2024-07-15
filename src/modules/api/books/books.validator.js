import validateWithSchema from '../../../shared/validateWithSchema.js';
import booksSchema from './books.schema.js';

const createBook = validateWithSchema([
    {
        schema: booksSchema.createBookSchema,
        property: 'body',
    },
]);

const getBooks = validateWithSchema([
    {
        schema: booksSchema.getBooksQuerySchema,
        property: 'query',
    },
]);

const getBook = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

const updateBook = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
    {
        schema: booksSchema.updateBookSchema,
        property: 'body',
    },
]);

const deleteBooks = validateWithSchema([
    {
        schema: booksSchema.bookIdsParamSchema,
        property: 'query',
    },
]);

const deleteBook = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

const booksValidator = {
    createBook,
    getBooks,
    getBook,
    updateBook,
    deleteBooks,
    deleteBook,
};

export default booksValidator;
