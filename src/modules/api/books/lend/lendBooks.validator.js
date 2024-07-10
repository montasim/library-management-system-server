import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './lendBooks.schema.js';

const createLendBooksSchema = validateWithSchema(
    [
        { schema: favouriteBooksSchema.createLendBooksSchema, property: 'body' },
    ]
);

const getLendBooksQuerySchema = validateWithSchema(
    [
        { schema: favouriteBooksSchema.getLendBooksQuerySchema, property: 'params' },
    ]
);

const lendBooksValidator = {
    createLendBooksSchema,
    getLendBooksQuerySchema
};

export default lendBooksValidator;
