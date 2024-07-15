import validateWithSchema from '../../../../shared/validateWithSchema.js';
import userRequestBooksSchema from './userRequestBooks.schema.js';

const createRequestBook = validateWithSchema(
    [
        {
            schema: userRequestBooksSchema.createRequestBookSchema,
            property: 'body'
        }
    ]
);

const requestBookId = validateWithSchema(
    [
        {
            schema: userRequestBooksSchema.requestBookIdSchema,
            property: 'params'
        }
    ]
);

const userRequestBooksValidator = {
    createRequestBook,
    requestBookId,
};

export default userRequestBooksValidator;
