import Joi from 'joi';

import subjectsConstants from './subjects.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

// Define base schema for subjects
const subjectSchemaBase = Joi.object({
    name: validationService.createStringField(
            subjectsConstants.lengths.NAME_MIN,
            subjectsConstants.lengths.NAME_MAX
        )
        .messages(customValidationMessage),
    isActive: validationService.booleanField,
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
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

// Schema for creating a subject, making specific fields required
const createSubjectSchema = subjectSchemaBase.fork(['name', 'isActive'], (field) =>
    field.required()
);

// Schema for updating a subject
const updateSubjectSchema = subjectSchemaBase
    .fork(['name', 'isActive'], (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple subject IDs
const subjectIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getSubjectsQuerySchema = subjectSchemaBase.fork(
    [
        'name',
        'isActive',
        'page',
        'limit',
        'sort',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedBy',
    ],
    (field) => field.optional()
);

// Schema for single subject ID validation
const subjectIdParamSchema = Joi.object({
    subjectId: validationService.objectIdField.required(),
}).strict();

const subjectsSchema = {
    createSubjectSchema,
    updateSubjectSchema,
    getSubjectsQuerySchema,
    subjectIdsParamSchema,
    subjectIdParamSchema,
};

export default subjectsSchema;
