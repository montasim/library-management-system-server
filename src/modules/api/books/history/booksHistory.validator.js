import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './booksHistory.schema.js';

const booksQueryParamSchema = validateWithSchema([
    {
        schema: favouriteBooksSchema.booksQueryParamSchema,
        property: 'params',
    },
]);

const bookIdParamSchema = validateWithSchema([
    {
        schema: favouriteBooksSchema.bookIdParamSchema,
        property: 'params',
    },
]);

const booksHistoryValidator = {
    booksQueryParamSchema,
    bookIdParamSchema,
};

export default booksHistoryValidator;
