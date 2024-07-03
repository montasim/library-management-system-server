import Joi from 'joi';

import permissionsConstants from './permissions.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';

// Define base schema for permissions
const permissionSchemaBase = Joi.object({
    name: Joi.string()
        .trim()
        .required()
        .min(permissionsConstants.lengths.NAME_MIN)
        .max(permissionsConstants.lengths.NAME_MAX)
        .messages(customValidationMessage),
    isActive: Joi.boolean().required().messages(customValidationMessage),
}).strict();

// Schema for creating a permission, making specific fields required
const createPermissionSchema = permissionSchemaBase.fork(['name'], (field) =>
    field.required()
);

// Schema for updating a permission
const updatePermissionSchema = permissionSchemaBase
    .fork(Object.keys(permissionSchemaBase.describe().keys), (field) =>
        field.optional()
    )
    .min(1);

// Schema for validating multiple permission IDs
const permissionIdsParamSchema = Joi.object({
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

const getPermissionsQuerySchema = Joi.object({
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
        .min(permissionsConstants.lengths.NAME_MIN)
        .max(permissionsConstants.lengths.NAME_MAX),
    isActive: Joi.string()
        .valid('true', 'false', '1', '0')
        .custom((value, helpers) => {
            if (value === 'true' || value === '1') {
                return true;
            } else if (value === 'false' || value === '0') {
                return false;
            }
            return helpers.error('any.invalid');
        })
        .messages({
            'any.only':
                'isActive must be a boolean value represented as true/false or 1/0.',
            ...customValidationMessage,
        }),
    createdBy: Joi.string().trim(),
    updatedBy: Joi.string().trim(),
})
    .strict()
    .messages(customValidationMessage);

// Schema for single permission ID validation
const permissionIdParamSchema = Joi.object({
    permissionId: Joi.string()
        .alphanum()
        .required()
        .messages(customValidationMessage),
}).strict();

const permissionsSchema = {
    createPermissionSchema,
    updatePermissionSchema,
    getPermissionsQuerySchema,
    permissionIdsParamSchema,
    permissionIdParamSchema,
};

export default permissionsSchema;
