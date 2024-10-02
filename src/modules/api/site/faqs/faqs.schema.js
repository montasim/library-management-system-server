import Joi from 'joi';

import faqsConstants from './faqs.constant.js';
import customValidationMessage from '../../../../shared/customValidationMessage.js';
import validationService from '../../../../service/validation.service.js';

const permissionSchemaBase = Joi.object({
    question: validationService
        .createStringField(
            faqsConstants.lengths.NAME_MIN,
            faqsConstants.lengths.NAME_MAX
        ),
    answer: validationService
        .createStringField(
            faqsConstants.lengths.NAME_MIN,
            faqsConstants.lengths.NAME_MAX
        ),
    page: Joi.string()
        .min(1)
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

const createFaqSchema = permissionSchemaBase.fork(
    ['question', 'answer'],
    (field) => field.required()
);

const updateFaqSchema = permissionSchemaBase
    .fork(Object.keys(permissionSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

const permissionIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getFaqsQuerySchema = permissionSchemaBase.fork(
    [
        'question',
        'answer',
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

const permissionIdParamSchema = Joi.object({
    permissionId: validationService.objectIdField.required(),
}).strict();

const faqsSchema = {
    createFaqSchema,
    updateFaqSchema,
    getFaqsQuerySchema,
    permissionIdsParamSchema,
    permissionIdParamSchema,
};

export default faqsSchema;
