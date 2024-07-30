import Joi from 'joi';

import permissionsConstants from './permissions.constant.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import validationService from '../../../service/validation.service.js';
import routesConstants from '../../../constant/routes.constants.js';
import generatePermissions from '../../../shared/generatePermissions.js';

const validNames = generatePermissions(routesConstants);

// Define base schema for permissions
const permissionSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            permissionsConstants.lengths.NAME_MIN,
            permissionsConstants.lengths.NAME_MAX
        )
        .regex(permissionsConstants.pattern.name)
        .valid(...validNames)
        .messages({
            'any.only': `Name must be one of the following: ${validNames.join(', ')}`,
            'string.pattern.base': 'Name must be one of above.',
        }),
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

const permissionIdsParamSchema = Joi.object({
    ids: validationService.objectIdsField.required(),
})
    .required()
    .messages(customValidationMessage);

const getPermissionsQuerySchema = permissionSchemaBase.fork(
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
