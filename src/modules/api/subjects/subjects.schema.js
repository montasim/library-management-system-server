import Joi from 'joi';

import subjectsConstants from './subjects.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';

// Define base schema for subjects
const subjectSchemaBase = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .min(subjectsConstants.lengths.NAME_MIN)
        .max(subjectsConstants.lengths.NAME_MAX)
        .messages(customValidationMessage),
}).strict();

// Schema for creating a subject, making specific fields required
const createSubjectSchema = subjectSchemaBase.fork(
    [
        'name'
    ],
    (field) => field.required()
);

// Schema for updating a subject
const updateSubjectSchema = subjectSchemaBase
    .fork(Object.keys(subjectSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple subject IDs
const subjectIdsParamSchema = Joi.object({
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

const getSubjectsQuerySchema = Joi.object({
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
        .min(subjectsConstants.lengths.NAME_MIN)
        .max(subjectsConstants.lengths.NAME_MAX),
    createdBy: Joi.string().trim(),
    updatedBy: Joi.string().trim(),
})
    .strict()
    .messages(customValidationMessage);

// Schema for single subject ID validation
const subjectIdParamSchema = Joi.object({
    subjectId: Joi.string()
        .alphanum()
        .required()
        .messages(customValidationMessage),
}).strict();

const subjectsSchema = {
    createSubjectSchema,
    updateSubjectSchema,
    getSubjectsQuerySchema,
    subjectIdsParamSchema,
    subjectIdParamSchema,
};

export default subjectsSchema;
