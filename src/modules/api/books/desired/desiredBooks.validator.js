import validateWithSchema from '../../../../shared/validateWithSchema.js';
import desiredBooksSchema from './desiredBooks.schema.js';

const getDesiredBooks = validateWithSchema([
    {
        schema: desiredBooksSchema.getDesiredBooksQuerySchema,
        property: 'query',
    },
]);

const desiredBooksValidator = {
    getDesiredBooks,
};

export default desiredBooksValidator;
