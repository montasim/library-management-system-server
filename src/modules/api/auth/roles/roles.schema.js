import Joi from 'joi';

import rolesConstants from './roles.constant.js';
import customValidationMessage from '../../../../shared/customValidationMessage.js';
import validationService from '../../../../service/validation.service.js';

// Define base schema for roles
const roleSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            rolesConstants.lengths.NAME_MIN,
            rolesConstants.lengths.NAME_MAX
        )
        .regex(rolesConstants.pattern.name)
            .messages({
                'string.pattern.base': `{#label} with value {#value} must start with an uppercase letter followed by lowercase letters, and must not include numbers or special characters.`,
            }),
    permissions: Joi.array()
        .items(
            validationService.objectIdsField.required(),
        )
        .required()
        .messages({
            'any.custom': 'Invalid permission ID format.',
            ...customValidationMessage,
        }),
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

// Schema for creating a role, making specific fields required
const createRoleSchema = roleSchemaBase.fork(['name'], (field) =>
    field.required()
);

// Schema for updating a role
const updateRoleSchema = roleSchemaBase
    .fork(Object.keys(roleSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple role IDs
const roleIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getRolesQuerySchema = roleSchemaBase.fork([
    'name',
    'permissions',
    'isActive',
    'page',
    'limit',
    'sort',
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedBy',
    ], (field) =>
    field.optional()
);

// Schema for single role ID validation
const roleIdParamSchema = Joi.object({
    roleId: validationService.objectIdField.required(),
}).strict();

const rolesSchema = {
    createRoleSchema,
    updateRoleSchema,
    getRolesQuerySchema,
    roleIdsParamSchema,
    roleIdParamSchema,
};

export default rolesSchema;
