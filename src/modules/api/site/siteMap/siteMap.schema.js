import Joi from 'joi';

import siteMapConstants from './siteMap.constant.js';
import validationService from '../../../../service/validation.service.js';
import customValidationMessage from '../../../../shared/customValidationMessage.js';

const siteMapSchemaBase = Joi.object({
    details: validationService
        .createStringField(
            siteMapConstants.lengths.CONTENT_MIN,
            siteMapConstants.lengths.CONTENT_MAX
        )
        .messages(customValidationMessage),
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

const createSiteMapSchema = siteMapSchemaBase.fork(
    ['details'],
    (field) => field.required()
);

const updateSiteMapSchema = siteMapSchemaBase
    .fork(['details'], (field) => field.optional())
    .min(1);

const getSiteMapQuerySchema = siteMapSchemaBase.fork(
    ['details', 'createdBy', 'updatedBy', 'createdAt', 'updatedBy'],
    (field) => field.optional()
);

const siteMapSchema = {
    createSiteMapSchema,
    updateSiteMapSchema,
    getSiteMapQuerySchema,
};

export default siteMapSchema;
