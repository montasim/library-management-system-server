/**
 * @fileoverview This file defines various Joi schemas for validating publications-related data. The
 * schemas include base validation for publication fields, as well as specific schemas for creating,
 * updating, and querying publications. The schemas ensure that data conforms to the required formats,
 * lengths, and patterns, and include custom validation messages for better error reporting.
 */

import Joi from 'joi';

import publicationsConstants from './publications.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

/**
 * publicationSchemaBase - Base Joi schema for validating publications-related fields. This schema includes:
 *
 * - name: String (trimmed, minLength, maxLength)
 * - page: String (minLength, default value, custom parsing to integer)
 * - limit: String (minLength, maxLength, default value, custom parsing to integer)
 * - sort: String (trimmed, default value)
 * - isActive: Boolean
 * - createdBy: ObjectId
 * - updatedBy: ObjectId
 * - createdAt: Date
 * - updatedAt: Date
 *
 * This schema is used as the base for more specific publications schemas.
 */
const publicationSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            publicationsConstants.lengths.NAME_MIN,
            publicationsConstants.lengths.NAME_MAX
        )
        .messages(customValidationMessage),
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

/**
 * createPublicationSchema - Joi schema for validating data when creating a publication. This schema
 * makes the 'name' and 'isActive' fields required.
 */
const createPublicationSchema = publicationSchemaBase.fork(
    ['name', 'isActive'],
    (field) => field.required()
);

/**
 * updatePublicationSchema - Joi schema for validating data when updating a publication. This schema
 * makes 'name' and 'isActive' fields optional and requires at least one field to be provided.
 */
const updatePublicationSchema = publicationSchemaBase
    .fork(['name', 'isActive'], (field) => field.optional())
    .min(1);

/**
 * publicationIdsParamSchema - Joi schema for validating a list of publication IDs passed as a parameter.
 * This schema ensures that the 'ids' field is an array of valid ObjectIds and includes custom validation
 * messages.
 */
const publicationIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

/**
 * getPublicationsQuerySchema - Joi schema for validating query parameters when retrieving publications.
 * This schema makes all fields optional and uses the base publications schema for validation.
 */
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

/**
 * publicationIdParamSchema - Joi schema for validating a single publication ID passed as a parameter.
 * This schema ensures that the 'publicationId' field is a valid ObjectId.
 */
const publicationIdParamSchema = Joi.object({
    publicationId: validationService.objectIdField.required(),
}).strict();

/**
 * publicationsSchema - Object containing all the defined Joi schemas for publications validation:
 *
 * - createPublicationSchema: Schema for validating data when creating a publication.
 * - updatePublicationSchema: Schema for validating data when updating a publication.
 * - getPublicationsQuerySchema: Schema for validating query parameters when retrieving publications.
 * - publicationIdsParamSchema: Schema for validating a list of publication IDs passed as a parameter.
 * - publicationIdParamSchema: Schema for validating a single publication ID passed as a parameter.
 */
const publicationsSchema = {
    createPublicationSchema,
    updatePublicationSchema,
    getPublicationsQuerySchema,
    publicationIdsParamSchema,
    publicationIdParamSchema,
};

export default publicationsSchema;
