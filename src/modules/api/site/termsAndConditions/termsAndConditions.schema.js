import Joi from 'joi';

import termsAndConditionsConstants from './termsAndConditions.constant.js';
import validationService from '../../../../service/validation.service.js';
import customValidationMessage from '../../../../shared/customValidationMessage.js';

const termsAndConditionsSchemaBase = Joi.object({
    details: validationService
        .createStringField(
            termsAndConditionsConstants.lengths.CONTENT_MIN,
            termsAndConditionsConstants.lengths.CONTENT_MAX
        )
        .messages(customValidationMessage),
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

const createTermsAndConditionsSchema = termsAndConditionsSchemaBase.fork(
    ['details'],
    (field) => field.required()
);

const updateTermsAndConditionsSchema = termsAndConditionsSchemaBase
    .fork(['details'], (field) => field.optional())
    .min(1);

const getTermsAndConditionsQuerySchema = termsAndConditionsSchemaBase.fork(
    ['details', 'createdBy', 'updatedBy', 'createdAt', 'updatedBy'],
    (field) => field.optional()
);

const termsAndConditionsSchema = {
    createTermsAndConditionsSchema,
    updateTermsAndConditionsSchema,
    getTermsAndConditionsQuerySchema,
};

export default termsAndConditionsSchema;
