import Joi from 'joi';

import publicationsConstants from './publications.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

// Define base schema for publications
const publicationSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            publicationsConstants.lengths.NAME_MIN,
            publicationsConstants.lengths.NAME_MAX
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

// Schema for creating a publication, making specific fields required
const createPublicationSchema = publicationSchemaBase.fork(
    ['name', 'isActive'],
    (field) => field.required()
);

// Schema for updating a publication
const updatePublicationSchema = publicationSchemaBase
    .fork(['name', 'isActive'], (field) => field.optional())
    .min(1);

// Schema for validating multiple publication IDs
const publicationIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getPublicationsQuerySchema = publicationSchemaBase.fork(
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

// Schema for single publication ID validation
const publicationIdParamSchema = Joi.object({
    publicationId: validationService.objectIdField.required(),
}).strict();

const publicationsSchema = {
    createPublicationSchema,
    updatePublicationSchema,
    getPublicationsQuerySchema,
    publicationIdsParamSchema,
    publicationIdParamSchema,
};

export default publicationsSchema;
