import validateWithSchema from '../../../shared/validateWithSchema.js';
import permissionsSchema from './permissions.schema.js';

const createPermission = validateWithSchema([
    { schema: permissionsSchema.createPermissionSchema, property: 'body' },
]);

const getPermissionList = validateWithSchema([
    { schema: permissionsSchema.getPermissionsQuerySchema, property: 'query' },
]);

const getPermissionById = validateWithSchema([
    {
        schema: permissionsSchema.permissionIdParamSchema,
        property: 'params',
    },
]);

const updatePermissionById = validateWithSchema([
    { schema: permissionsSchema.permissionIdParamSchema, property: 'params' },
    { schema: permissionsSchema.updatePermissionSchema, property: 'body' },
]);

const deletePermissionList = validateWithSchema([
    {
        schema: permissionsSchema.permissionIdsParamSchema,
        property: 'query',
    },
]);

const deletePermissionById = validateWithSchema([
    {
        schema: permissionsSchema.permissionIdParamSchema,
        property: 'params',
    },
]);

const permissionsValidator = {
    createPermission,
    getPermissionList,
    getPermissionById,
    updatePermissionById,
    deletePermissionList,
    deletePermissionById,
};

export default permissionsValidator;
