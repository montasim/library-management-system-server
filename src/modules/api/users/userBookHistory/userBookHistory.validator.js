import validateWithSchema from '../../../../shared/validateWithSchema.js';
import userBookHistorySchema from './userBookHistory.schema.js';

const booksQueryParamSchema = validateWithSchema([
    {
        schema: userBookHistorySchema.booksQueryParamSchema,
        property: 'params',
    },
]);

const bookIdParamSchema = validateWithSchema([
    {
        schema: userBookHistorySchema.bookIdParamSchema,
        property: 'params',
    },
]);

const userBookHistoryValidator = {
    booksQueryParamSchema,
    bookIdParamSchema,
};

export default userBookHistoryValidator;
