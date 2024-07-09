import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';

// Schema for single book ID validation
const bookIdParamSchema = Joi.object({
    bookId: validationService.objectIdField.required(),
}).strict();

const booksSchema = {
    bookIdParamSchema
};

export default booksSchema;
