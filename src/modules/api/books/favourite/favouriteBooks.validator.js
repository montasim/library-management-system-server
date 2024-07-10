import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './favouriteBooks.schema.js';

const favouriteBookIdParamSchema = validateWithSchema([
    {
        schema: favouriteBooksSchema.favouriteBookIdParamSchema,
        property: 'params',
    },
]);

const favouriteBooksValidator = {
    favouriteBookIdParamSchema,
};

export default favouriteBooksValidator;
