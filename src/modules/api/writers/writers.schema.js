import Joi from 'joi';

import writersConstants from './writers.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';

// Define base schema for writers
const writerSchemaBase = Joi.object({
    name: Joi.string()
        .trim()
        .min(writersConstants.lengths.NAME_MIN)
        .max(writersConstants.lengths.NAME_MAX)
        .messages(customValidationMessage),
    image: Joi.string().uri().trim().messages(customValidationMessage),
    review: Joi.number().min(0).max(5).messages(customValidationMessage),
    summary: Joi.string()
        .trim()
        .min(writersConstants.lengths.SUMMARY_MIN)
        .max(writersConstants.lengths.SUMMARY_MAX)
        .messages(customValidationMessage),
}).strict();

// Schema for creating a writer, making specific fields required
const createWriterSchema = writerSchemaBase.fork(
    ['name', 'image', 'review', 'summary'],
    (field) => field.required()
);

// Schema for updating a writer
const updateWriterSchema = writerSchemaBase
    .fork(Object.keys(writerSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple writer IDs
const writerIdsParamSchema = Joi.object({
    ids: Joi.string()
        .custom((value, helpers) => {
            const ids = value.split(',');
            ids.forEach((id) => {
                const { error } = Joi.string().alphanum().validate(id);
                if (error) {
                    throw new Error(`Invalid ID provided.`);
                }
            });
            return value; // Return original value if validation passes
        })
        .required()
        .messages(customValidationMessage),
}).required();

const getWritersQuerySchema = Joi.object({
    page: Joi.string()
        .min(1)
        .default(1)
        .custom((value, helpers) => parseInt(value)),
    limit: Joi.string()
        .min(1)
        .max(100)
        .default(10)
        .custom((value, helpers) => parseInt(value)),
    sort: Joi.string().trim().default('createdAt'),
    name: Joi.string()
        .trim()
        .min(writersConstants.lengths.NAME_MIN)
        .max(writersConstants.lengths.NAME_MAX),
    review: Joi.string()
        .custom((value, helpers) => parseFloat(value))
        .min(0)
        .max(5),
    summary: Joi.string()
        .trim()
        .min(writersConstants.lengths.SUMMARY_MIN)
        .max(writersConstants.lengths.SUMMARY_MAX),
    createdBy: Joi.string().trim(),
    updatedBy: Joi.string().trim(),
})
    .strict()
    .messages(customValidationMessage);

// Schema for single writer ID validation
const writerIdParamSchema = Joi.object({
    writerId: Joi.string()
        .alphanum()
        .required()
        .messages(customValidationMessage),
}).strict();

const writersSchema = {
    createWriterSchema,
    updateWriterSchema,
    getWritersQuerySchema,
    writerIdsParamSchema,
    writerIdParamSchema,
};

export default writersSchema;
