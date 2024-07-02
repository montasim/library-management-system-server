import Joi from 'joi';

import publicationsConstants from './publications.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';

// Define base schema for publications
const publicationSchemaBase = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .min(publicationsConstants.lengths.NAME_MIN)
        .max(publicationsConstants.lengths.NAME_MAX)
        .messages(customValidationMessage),
}).strict();

// Schema for creating a publication, making specific fields required
const createPublicationSchema = publicationSchemaBase.fork(['name'], (field) =>
    field.required()
);

// Schema for updating a publication
const updatePublicationSchema = publicationSchemaBase
    .fork(Object.keys(publicationSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple publication IDs
const publicationIdsParamSchema = Joi.object({
    ids: Joi.string()
        .custom((value, helpers) => {
            const ids = value.split(',');
            ids.forEach((id) => {
                const { error } = Joi.string().alphanum().validate(id);
                if (error) {
                    throw new Error(`Invalid ID provided.`);
                }
            });
            return value; // Return original value if validation passes
        })
        .required()
        .messages(customValidationMessage),
}).required();

const getPublicationsQuerySchema = Joi.object({
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
    name: Joi.string()
        .trim()
        .min(publicationsConstants.lengths.NAME_MIN)
        .max(publicationsConstants.lengths.NAME_MAX),
    createdBy: Joi.string().trim(),
    updatedBy: Joi.string().trim(),
})
    .strict()
    .messages(customValidationMessage);

// Schema for single publication ID validation
const publicationIdParamSchema = Joi.object({
    publicationId: Joi.string()
        .alphanum()
        .required()
        .messages(customValidationMessage),
}).strict();

const publicationsSchema = {
    createPublicationSchema,
    updatePublicationSchema,
    getPublicationsQuerySchema,
    publicationIdsParamSchema,
    publicationIdParamSchema,
};

export default publicationsSchema;
