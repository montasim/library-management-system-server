import validateWithSchema from '../../../../shared/validateWithSchema.js';
import returnBookSchema from './returnBooks.schema.js';

const returnBooksSchema = validateWithSchema([
    { schema: returnBookSchema.returnSchema, property: 'body' },
]);

const returnBooksValidator = {
    returnBooksSchema,
};

export default returnBooksValidator;
