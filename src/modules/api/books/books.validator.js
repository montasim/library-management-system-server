import validateWithSchema from '../../../shared/validateWithSchema.js';
import booksSchema from './books.schema.js';

const createNewBook = validateWithSchema([
    {
        schema: booksSchema.createBookSchema,
        property: 'body',
    },
]);

const getBookList = validateWithSchema([
    {
        schema: booksSchema.getBooksQuerySchema,
        property: 'query',
    },
]);

const getBookById = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

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

const deleteBookList = validateWithSchema([
    {
        schema: booksSchema.bookIdsParamSchema,
        property: 'query',
    },
]);

const deleteBookById = validateWithSchema([
    {
        schema: booksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

const booksValidator = {
    createNewBook,
    getBookList,
    getBookById,
    updateBookById,
    deleteBookList,
    deleteBookById,
};

export default booksValidator;
