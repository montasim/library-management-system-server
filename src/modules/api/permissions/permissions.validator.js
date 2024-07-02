import validateWithSchema from '../../../shared/validateWithSchema.js';
import permissionsSchema from './permissions.schema.js';

const createPermission = validateWithSchema(
    permissionsSchema.createPermissionSchema,
    'body'
);
const getPermissions = validateWithSchema(
    permissionsSchema.getPermissionsQuerySchema,
    'query'
);
const getPermission = validateWithSchema(
    permissionsSchema.permissionIdParamSchema,
    'params'
);
const updatePermission = validateWithSchema(
    permissionsSchema.updatePermissionSchema,
    'body'
);
const deletePermissions = validateWithSchema(
    permissionsSchema.permissionIdsParamSchema,
    'query'
);
const deletePermission = validateWithSchema(
    permissionsSchema.permissionIdParamSchema,
    'params'
);

const permissionsValidator = {
    createPermission,
    getPermissions,
    getPermission,
    updatePermission,
    deletePermissions,
    deletePermission,
};

export default permissionsValidator;
