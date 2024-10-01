import Joi from 'joi';

import aboutUsConstants from './aboutUs.constant.js';
import validationService from '../../../../service/validation.service.js';
import customValidationMessage
    from '../../../../shared/customValidationMessage.js';

const aboutUsSchemaBase = Joi.object({
    details: validationService
        .createStringField(
            aboutUsConstants.lengths.CONTENT_MIN,
            aboutUsConstants.lengths.CONTENT_MAX
        )
        .messages(customValidationMessage),
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

const createAboutUsSchema = aboutUsSchemaBase.fork(
    ['details'],
    (field) => field.required()
);

const updateAboutUsSchema = aboutUsSchemaBase
    .fork(['details'], (field) => field.optional())
    .min(1);

const getAboutUsQuerySchema = aboutUsSchemaBase.fork(
    [
        'details',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedBy',
    ],
    (field) => field.optional()
);

const aboutUsSchema = {
    createAboutUsSchema,
    updateAboutUsSchema,
    getAboutUsQuerySchema,
};

export default aboutUsSchema;
