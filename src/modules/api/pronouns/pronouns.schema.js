import Joi from 'joi';

import pronounsConstants from './pronouns.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

// Define base schema for pronouns
const pronounsSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            pronounsConstants.lengths.NAME_MIN,
            pronounsConstants.lengths.NAME_MAX
        )
        .regex(pronounsConstants.pattern.NAME)
        .messages({
            'string.empty': 'Name cannot be empty.',
            'string.min': `Name must be at least ${pronounsConstants.lengths.NAME_MIN} characters long.`,
            'string.max': `Name cannot be more than ${pronounsConstants.lengths.NAME_MAX} characters long.`,
            'string.pattern.base':
                'Name must only contain alphabetic characters and appropriate separators like spaces. For example, "Male", "Female".',
            'any.required': 'Name is required.',
        }),
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

// Schema for creating a pronouns, making specific fields required
const createPronounsSchema = pronounsSchemaBase.fork(
    ['name', 'isActive'],
    (field) => field.required()
);

// Schema for updating a pronouns
const updatePronounsSchema = pronounsSchemaBase
    .fork(Object.keys(pronounsSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

const pronounsIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getPronounsQuerySchema = pronounsSchemaBase.fork(
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

// Schema for single pronouns ID validation
const pronounsIdParamSchema = Joi.object({
    pronounsId: validationService.objectIdField.required(),
}).strict();

const pronounsSchema = {
    createPronounsSchema,
    updatePronounsSchema,
    getPronounsQuerySchema,
    pronounsIdsParamSchema,
    pronounsIdParamSchema,
};

export default pronounsSchema;
