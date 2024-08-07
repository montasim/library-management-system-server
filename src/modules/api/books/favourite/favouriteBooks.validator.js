/**
 * @fileoverview This file defines and exports validation middleware for favourite books-related routes.
 * The middleware uses Joi schemas to validate request parameters and ensures that the incoming data
 * meets the required criteria before passing control to the respective controllers.
 */

import validateWithSchema from '../../../../shared/validateWithSchema.js';
import favouriteBooksSchema from './favouriteBooks.schema.js';

/**
 * favouriteBookIdParamSchema - Validation middleware for validating the favourite book ID parameter.
 * Ensures that the favouriteBookId parameter in the request meets the required criteria.
 *
 * @function
 */
const favouriteBookIdParamSchema = validateWithSchema([
    {
        schema: favouriteBooksSchema.favouriteBookIdParamSchema,
        property: 'params',
    },
]);

/**
 * favouriteBooksValidator - An object that holds the validation middleware for favourite books-related routes.
 * These middleware functions validate the request parameters for routes that handle favourite books.
 *
 * @typedef {Object} FavouriteBooksValidator
 * @property {Function} favouriteBookIdParamSchema - Validation middleware for validating the favourite book ID parameter.
 */
const favouriteBooksValidator = {
    favouriteBookIdParamSchema,
};

export default favouriteBooksValidator;
