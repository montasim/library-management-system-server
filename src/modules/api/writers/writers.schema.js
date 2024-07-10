import Joi from 'joi';

import writersConstants from './writers.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';
import permissionsConstants from '../auth/permissions/permissions.constant.js';

// Define base schema for writers
const writerSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            writersConstants.lengths.NAME_MIN,
            writersConstants.lengths.NAME_MAX
        ),
    review: Joi.number().min(0).max(5).messages(customValidationMessage),
    summary: validationService
        .createStringField(
            writersConstants.lengths.SUMMARY_MIN,
            writersConstants.lengths.SUMMARY_MAX
        ),
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
    isActive: validationService.booleanField,
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

// Schema for creating a writer, making specific fields required
const createWriterSchema = writerSchemaBase.fork(
    ['name', 'review', 'summary', 'isActive'],
    (field) => field.required()
);

// Schema for updating a writer
const updateWriterSchema = writerSchemaBase
    .fork(['name', 'review', 'summary', 'isActive'], (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple writer IDs
const writerIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getWritersQuerySchema = writerSchemaBase.fork(
    [
        'name',
        'review',
        'summary',
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

// Schema for single writer ID validation
const writerIdParamSchema = Joi.object({
    writerId: validationService.objectIdField.required(),
}).strict();

const writersSchema = {
    createWriterSchema,
    updateWriterSchema,
    getWritersQuerySchema,
    writerIdsParamSchema,
    writerIdParamSchema,
};

export default writersSchema;
