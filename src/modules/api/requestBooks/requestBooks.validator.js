import validateWithSchema from '../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './requestBooks.schema.js';

const createFavouriteBook = validateWithSchema(favouriteBooksSchema.createFavouriteBookSchema, 'params');
const deleteFavouriteBook = validateWithSchema(favouriteBooksSchema.deleteFavouriteBookSchema, 'params');

const requestBooksValidator = {
    createFavouriteBook,
    deleteFavouriteBook,
};

export default requestBooksValidator;
