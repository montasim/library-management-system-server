import validateWithSchema from '../../../../shared/validateWithSchema.js';
import permissionsSchema from './permissions.schema.js';

const createPermission = validateWithSchema([
    { schema: permissionsSchema.createPermissionSchema, property: 'body' },
]);

const getPermissions = validateWithSchema([
    { schema: permissionsSchema.getPermissionsQuerySchema, property: 'query' },
]);

const getPermission = validateWithSchema([
    {
        schema: permissionsSchema.permissionIdParamSchema,
        property: 'params',
    },
]);

const updatePermission = validateWithSchema([
    { schema: permissionsSchema.permissionIdParamSchema, property: 'params' },
    { schema: permissionsSchema.updatePermissionSchema, property: 'body' },
]);

const deletePermissions = validateWithSchema([
    {
        schema: permissionsSchema.permissionIdsParamSchema,
        property: 'query',
    },
]);

const deletePermission = validateWithSchema([
    {
        schema: permissionsSchema.permissionIdParamSchema,
        property: 'params',
    },
]);

const permissionsValidator = {
    createPermission,
    getPermissions,
    getPermission,
    updatePermission,
    deletePermissions,
    deletePermission,
};

export default permissionsValidator;
