import validateWithSchema from '../../../../shared/validateWithSchema.js';
import requestBooksSchema from './requestBooks.schema.js';

const createRequestBook = validateWithSchema(
    [
        {
            schema: requestBooksSchema.createRequestBookSchema,
            property: 'body'
        }
    ]
);

const requestBookId = validateWithSchema(
    [
        {
            schema: requestBooksSchema.requestBookIdSchema,
            property: 'params'
        }
    ]
);

const ownerId = validateWithSchema(
    [
        {
            schema: requestBooksSchema.ownerIdSchema,
            property: 'params'
        }
    ]
);

const requestBooksValidator = {
    createRequestBook,
    requestBookId,
    ownerId,
};

export default requestBooksValidator;
