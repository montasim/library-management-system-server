import Joi from 'joi';
import validationService from '../../../../service/validation.service.js';

const add = Joi.object({
    book: validationService.objectIdField.required(),
}).strict();

const recentlyVisitedBooksSchema = {
    add,
};

export default recentlyVisitedBooksSchema;
