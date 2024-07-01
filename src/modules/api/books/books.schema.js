import Joi from 'joi';

import customValidationMessage
    from '../../../shared/customValidationMessage.js';

const bookSchemaBase = Joi.object({
    name: Joi.string().required(),
    bestSeller: Joi.number().integer().valid(1),
    image: Joi.string().uri(),
    review: Joi.number().min(0).max(5),
    writer: Joi.string(),
    subject: Joi.array().items(Joi.string()),
    publication: Joi.string(),
    page: Joi.number().integer(),
    edition: Joi.string(),
    summary: Joi.string(),
    price: Joi.number().precision(2),
    stockAvailable: Joi.number().integer(),
    createdBy: Joi.string(),
    updatedBy: Joi.string()
}).messages(customValidationMessage);

const createBookSchema = bookSchemaBase.fork(['bestSeller', 'image', 'review', 'writer', 'subject', 'publication', 'page', 'edition', 'summary', 'price', 'stockAvailable', 'createdBy'], field => field.required());
const updateBookSchema = bookSchemaBase.fork(Object.keys(bookSchemaBase.describe().keys), field => field.optional()).min(1);
const getBooksQuerySchema = Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sort: Joi.string(),
    filter: Joi.string()
});
const bookIdParamSchema = Joi.object({
    bookId: Joi.string().alphanum().required()
});

const booksSchema = {
    createBookSchema,
    updateBookSchema,
    getBooksQuerySchema,
    bookIdParamSchema,
};

export default booksSchema;
