import validateWithSchema from '../../../shared/validateWithSchema.js';
import booksSchema from './books.schema.js';

const createBook = validateWithSchema(booksSchema.createBookSchema);
const getBooks = validateWithSchema(booksSchema.getBooksQuerySchema, 'query');
const updateBook = validateWithSchema(booksSchema.updateBookSchema);
const deleteBook = validateWithSchema(booksSchema.bookIdParamSchema, 'params');

const booksValidator = {
    createBook,
    getBooks,
    updateBook,
    deleteBook,
};

export default booksValidator;
