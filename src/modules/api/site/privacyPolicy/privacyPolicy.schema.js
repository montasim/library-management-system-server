import Joi from 'joi';

import privacyPolicyConstants from './privacyPolicy.constant.js';
import validationService from '../../../../service/validation.service.js';
import customValidationMessage from '../../../../shared/customValidationMessage.js';

const privacyPolicySchemaBase = Joi.object({
    details: validationService
        .createStringField(
            privacyPolicyConstants.lengths.CONTENT_MIN,
            privacyPolicyConstants.lengths.CONTENT_MAX
        )
        .messages(customValidationMessage),
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

const createPrivacyPolicySchema = privacyPolicySchemaBase.fork(
    ['details'],
    (field) => field.required()
);

const updatePrivacyPolicySchema = privacyPolicySchemaBase
    .fork(['details'], (field) => field.optional())
    .min(1);

const getPrivacyPolicyQuerySchema = privacyPolicySchemaBase.fork(
    ['details', 'createdBy', 'updatedBy', 'createdAt', 'updatedBy'],
    (field) => field.optional()
);

const privacyPolicySchema = {
    createPrivacyPolicySchema,
    updatePrivacyPolicySchema,
    getPrivacyPolicyQuerySchema,
};

export default privacyPolicySchema;
