import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';

// Schema for single book ID validation
const favouriteBookIdParamSchema = Joi.object({
    favouriteBookId: validationService.objectIdField.required(),
}).strict();

const booksSchema = {
    createFavouriteBookSchema: favouriteBookIdParamSchema,
    deleteFavouriteBookSchema: favouriteBookIdParamSchema,
};

export default booksSchema;
