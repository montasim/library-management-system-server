/**
 * @fileoverview This file defines various Joi schemas for validating subjects-related data. The
 * schemas include base validation for subject fields, as well as specific schemas for creating,
 * updating, and querying subjects. The schemas ensure that data conforms to the required formats,
 * lengths, and patterns, and include custom validation messages for better error reporting.
 */

import Joi from 'joi';

import subjectsConstants from './subjects.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';

/**
 * subjectSchemaBase - Base Joi schema for validating subjects-related fields. This schema includes:
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
 * This schema is used as the base for more specific subjects schemas.
 */
const subjectSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            subjectsConstants.lengths.NAME_MIN,
            subjectsConstants.lengths.NAME_MAX
        )
        .messages(customValidationMessage),
    page: Joi.string()
        .min(1)
        .custom((value, helpers) => parseInt(value)),
    limit: Joi.string()
        .min(1)
        .max(100)
        .custom((value, helpers) => parseInt(value)),
    sort: Joi.string().trim().default('createdAt'),
    isActive: validationService.booleanField,
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

/**
 * createSubjectSchema - Joi schema for validating data when creating a subject. This schema
 * makes the 'name' and 'isActive' fields required.
 */
const createSubjectSchema = subjectSchemaBase.fork(
    ['name', 'isActive'],
    (field) => field.required()
);

/**
 * updateSubjectSchema - Joi schema for validating data when updating a subject. This schema
 * makes the 'name' and 'isActive' fields optional and requires at least one field to be provided.
 */
const updateSubjectSchema = subjectSchemaBase
    .fork(['name', 'isActive'], (field) => field.optional())
    .min(1);

/**
 * subjectIdsParamSchema - Joi schema for validating a list of subject IDs passed as a parameter.
 * This schema ensures that the 'ids' field is an array of valid ObjectIds and includes custom validation
 * messages.
 */
const subjectIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

/**
 * getSubjectsQuerySchema - Joi schema for validating query parameters when retrieving subjects.
 * This schema makes all fields optional and uses the base subjects schema for validation.
 */
const getSubjectsQuerySchema = subjectSchemaBase.fork(
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
 * subjectIdParamSchema - Joi schema for validating a single subject ID passed as a parameter.
 * This schema ensures that the 'subjectId' field is a valid ObjectId.
 */
const subjectIdParamSchema = Joi.object({
    subjectId: validationService.objectIdField.required(),
}).strict();

/**
 * subjectsSchema - Object containing all the defined Joi schemas for subjects validation:
 *
 * - createSubjectSchema: Schema for validating data when creating a subject.
 * - updateSubjectSchema: Schema for validating data when updating a subject.
 * - getSubjectsQuerySchema: Schema for validating query parameters when retrieving subjects.
 * - subjectIdsParamSchema: Schema for validating a list of subject IDs passed as a parameter.
 * - subjectIdParamSchema: Schema for validating a single subject ID passed as a parameter.
 */
const subjectsSchema = {
    createSubjectSchema,
    updateSubjectSchema,
    getSubjectsQuerySchema,
    subjectIdsParamSchema,
    subjectIdParamSchema,
};

export default subjectsSchema;
