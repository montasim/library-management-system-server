import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './booksHistory.schema.js';

const bookIdParamSchema = validateWithSchema(
    [
        {
            schema: favouriteBooksSchema.bookIdParamSchema,
            property: 'params'
        }
    ]
);

const booksHistoryValidator = {
    bookIdParamSchema,
};

export default booksHistoryValidator;
