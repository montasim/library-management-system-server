/**
 * @fileoverview This file defines various Joi schemas for validating writer-related data.
 * The schemas include base validation for writer fields, as well as specific schemas for creating, updating, and querying writers.
 * These schemas ensure that data conforms to the required formats, lengths, and patterns, and include custom validation messages for better error reporting.
 */

import Joi from 'joi';

import writersConstants from './writers.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

/**
 * Base Joi schema for validating writer-related fields.
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
const writerSchemaBase = Joi.object({
    name: validationService.createStringField(
        writersConstants.lengths.NAME_MIN,
        writersConstants.lengths.NAME_MAX
    ),
    review: Joi.number().min(0).max(5).messages(customValidationMessage),
    summary: validationService.createStringField(
        writersConstants.lengths.SUMMARY_MIN,
        writersConstants.lengths.SUMMARY_MAX
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
 * Joi schema for validating data when creating a writer.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema extends the base writer schema and makes the fields 'name', 'review', 'summary', and 'isActive' required.
 */
const createWriterSchema = writerSchemaBase.fork(
    ['name', 'review', 'summary', 'isActive'],
    (field) => field.required()
);

/**
 * Joi schema for validating data when updating a writer.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema extends the base writer schema and makes the fields 'name', 'review', 'summary', and 'isActive' optional.
 * It ensures that at least one field is provided for the update.
 */
const updateWriterSchema = writerSchemaBase
    .fork(['name', 'review', 'summary', 'isActive'], (field) =>
        field.optional()
    )
    .min(1);

/**
 * Joi schema for validating multiple writer IDs passed as a parameter.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema ensures that the 'ids' field is an array of valid ObjectIds.
 */
const writerIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

/**
 * Joi schema for validating query parameters when retrieving writers.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema makes all fields optional and uses the base writer schema for validation.
 */
const getWritersQuerySchema = writerSchemaBase.fork(
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
 * Joi schema for validating a single writer ID passed as a parameter.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema ensures that the 'writerId' field is a valid ObjectId.
 */
const writerIdParamSchema = Joi.object({
    writerId: validationService.objectIdField.required(),
}).strict();

/**
 * Object containing all the defined Joi schemas for writer validation.
 *
 * @constant
 * @type {Object}
 * @property {Joi.ObjectSchema} createWriterSchema - Schema for validating data when creating a writer.
 * @property {Joi.ObjectSchema} updateWriterSchema - Schema for validating data when updating a writer.
 * @property {Joi.ObjectSchema} getWritersQuerySchema - Schema for validating query parameters when retrieving writers.
 * @property {Joi.ObjectSchema} writerIdsParamSchema - Schema for validating multiple writer IDs passed as a parameter.
 * @property {Joi.ObjectSchema} writerIdParamSchema - Schema for validating a single writer ID passed as a parameter.
 */
const writersSchema = {
    createWriterSchema,
    updateWriterSchema,
    getWritersQuerySchema,
    writerIdsParamSchema,
    writerIdParamSchema,
};

export default writersSchema;
