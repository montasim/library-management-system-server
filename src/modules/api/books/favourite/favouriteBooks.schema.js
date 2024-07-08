import Joi from 'joi';

import customValidationMessage from '../../../../shared/customValidationMessage.js';

// Schema for single book ID validation
const favouriteBookIdParamSchema = Joi.object({
    favouriteBookId: Joi.string()
        .alphanum()
        .required()
        .messages(customValidationMessage),
}).strict();

const booksSchema = {
    createFavouriteBookSchema: favouriteBookIdParamSchema,
    deleteFavouriteBookSchema: favouriteBookIdParamSchema
};

export default booksSchema;
