import Joi from 'joi';

import faqsConstants from './faqs.constant.js';
import customValidationMessage from '../../../../shared/customValidationMessage.js';
import validationService from '../../../../service/validation.service.js';

const faqSchemaBase = Joi.object({
    question: validationService
        .createStringField(
            faqsConstants.lengths.QUESTION_MIN,
            faqsConstants.lengths.QUESTION_MAX
        ),
    answer: validationService
        .createStringField(
            faqsConstants.lengths.ANSWER_MIN,
            faqsConstants.lengths.ANSWER_MAX
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

const createFaqSchema = faqSchemaBase.fork(
    ['question', 'answer'],
    (field) => field.required()
);

const updateFaqSchema = faqSchemaBase
    .fork(Object.keys(faqSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

const faqIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getFaqsQuerySchema = faqSchemaBase.fork(
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

const faqIdParamSchema = Joi.object({
    faqId: validationService.objectIdField.required(),
}).strict();

const faqsSchema = {
    createFaqSchema,
    updateFaqSchema,
    getFaqsQuerySchema,
    faqIdsParamSchema,
    faqIdParamSchema,
};

export default faqsSchema;
