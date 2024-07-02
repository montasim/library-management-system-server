import Joi from 'joi';

import rolesConstants from './roles.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';

// Define base schema for roles
const roleSchemaBase = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .min(rolesConstants.lengths.NAME_MIN)
        .max(rolesConstants.lengths.NAME_MAX)
        .messages(customValidationMessage),
}).strict();

// Schema for creating a role, making specific fields required
const createRoleSchema = roleSchemaBase.fork(
    [
        'name'
    ],
    (field) => field.required()
);

// Schema for updating a role
const updateRoleSchema = roleSchemaBase
    .fork(Object.keys(roleSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple role IDs
const roleIdsParamSchema = Joi.object({
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

const getRolesQuerySchema = Joi.object({
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
        .min(rolesConstants.lengths.NAME_MIN)
        .max(rolesConstants.lengths.NAME_MAX),
    createdBy: Joi.string().trim(),
    updatedBy: Joi.string().trim(),
})
    .strict()
    .messages(customValidationMessage);

// Schema for single role ID validation
const roleIdParamSchema = Joi.object({
    roleId: Joi.string()
        .alphanum()
        .required()
        .messages(customValidationMessage),
}).strict();

const rolesSchema = {
    createRoleSchema,
    updateRoleSchema,
    getRolesQuerySchema,
    roleIdsParamSchema,
    roleIdParamSchema,
};

export default rolesSchema;