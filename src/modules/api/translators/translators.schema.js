/**
 * @fileoverview This file defines various Joi schemas for validating translator-related data.
 * The schemas include base validation for translator fields, as well as specific schemas for creating, updating, and querying translators.
 * These schemas ensure that data conforms to the required formats, lengths, and patterns, and include custom validation messages for better error reporting.
 */

import Joi from 'joi';

import translatorsConstants from './translators.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

/**
 * Base Joi schema for validating translator-related fields.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema includes validation rules for:
 * - name: String (with length constraints)
 * - review: Number (between 0 and 5)
 * - summary: String (with length constraints)
 * - page: String (minimum length, default value, custom parsing to integer)
 * - limit: String (minimum length, maximum length, default value, custom parsing to integer)
 * - sort: String (trimmed, default value)
 * - isActive: Boolean
 * - createdBy: ObjectId
 * - updatedBy: ObjectId
 * - createdAt: Date
 * - updatedAt: Date
 */
const translatorSchemaBase = Joi.object({
    name: validationService.createStringField(
        translatorsConstants.lengths.NAME_MIN,
        translatorsConstants.lengths.NAME_MAX
    ),
    review: Joi.number().min(0).max(5).messages(customValidationMessage),
    summary: validationService.createStringField(
        translatorsConstants.lengths.SUMMARY_MIN,
        translatorsConstants.lengths.SUMMARY_MAX
    ),
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
 * Joi schema for validating data when creating a translator.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema extends the base translator schema and makes the fields 'name', 'review', 'summary', and 'isActive' required.
 */
const createTranslatorSchema = translatorSchemaBase.fork(
    ['name', 'review', 'summary', 'isActive'],
    (field) => field.required()
);

/**
 * Joi schema for validating data when updating a translator.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema extends the base translator schema and makes the fields 'name', 'review', 'summary', and 'isActive' optional.
 * It ensures that at least one field is provided for the update.
 */
const updateTranslatorSchema = translatorSchemaBase
    .fork(['name', 'review', 'summary', 'isActive'], (field) =>
        field.optional()
    )
    .min(1);

/**
 * Joi schema for validating multiple translator IDs passed as a parameter.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema ensures that the 'ids' field is an array of valid ObjectIds.
 */
const translatorIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

/**
 * Joi schema for validating query parameters when retrieving translators.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema makes all fields optional and uses the base translator schema for validation.
 */
const getTranslatorsQuerySchema = translatorSchemaBase.fork(
    [
        'name',
        'review',
        'summary',
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
 * Joi schema for validating a single translator ID passed as a parameter.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema ensures that the 'translatorId' field is a valid ObjectId.
 */
const translatorIdParamSchema = Joi.object({
    translatorId: validationService.objectIdField.required(),
}).strict();

/**
 * Object containing all the defined Joi schemas for translator validation.
 *
 * @constant
 * @type {Object}
 * @property {Joi.ObjectSchema} createTranslatorSchema - Schema for validating data when creating a translator.
 * @property {Joi.ObjectSchema} updateTranslatorSchema - Schema for validating data when updating a translator.
 * @property {Joi.ObjectSchema} getTranslatorsQuerySchema - Schema for validating query parameters when retrieving translators.
 * @property {Joi.ObjectSchema} translatorIdsParamSchema - Schema for validating multiple translator IDs passed as a parameter.
 * @property {Joi.ObjectSchema} translatorIdParamSchema - Schema for validating a single translator ID passed as a parameter.
 */
const translatorsSchema = {
    createTranslatorSchema,
    updateTranslatorSchema,
    getTranslatorsQuerySchema,
    translatorIdsParamSchema,
    translatorIdParamSchema,
};

export default translatorsSchema;
