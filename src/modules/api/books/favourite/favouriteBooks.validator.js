import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './favouriteBooks.schema.js';

const createFavouriteBook = validateWithSchema(
    favouriteBooksSchema.createFavouriteBookSchema,
    'params'
);
const deleteFavouriteBook = validateWithSchema(
    favouriteBooksSchema.deleteFavouriteBookSchema,
    'params'
);

const favouriteBooksValidator = {
    createFavouriteBook,
    deleteFavouriteBook,
};

export default favouriteBooksValidator;
