import Joi from 'joi';

import permissionsConstants from './permissions.constant.js';
import customValidationMessage from '../../../../shared/customValidationMessage.js';
import validationService from '../../../../service/validation.service.js';

// Define base schema for permissions
const permissionSchemaBase = Joi.object({
    name: validationService.createStringField(
        permissionsConstants.lengths.NAME_MIN,
        permissionsConstants.lengths.NAME_MAX
    ),
    isActive: validationService.booleanField,
}).strict();

// Schema for creating a permission, making specific fields required
const createPermissionSchema = permissionSchemaBase.fork(
    ['name', 'isActive'],
    (field) => field.required()
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
    name: validationService.createStringField(
        permissionsConstants.lengths.NAME_MIN,
        permissionsConstants.lengths.NAME_MAX
    ),
    isActive: validationService.booleanField,
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
})
    .strict()
    .messages(customValidationMessage);

// Schema for single permission ID validation
const permissionIdParamSchema = Joi.object({
    permissionId: validationService.objectIdField.required(),
}).strict();

const permissionsSchema = {
    createPermissionSchema,
    updatePermissionSchema,
    getPermissionsQuerySchema,
    permissionIdsParamSchema,
    permissionIdParamSchema,
};

export default permissionsSchema;
