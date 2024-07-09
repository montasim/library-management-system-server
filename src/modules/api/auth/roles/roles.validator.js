import validateWithSchema from '../../../../shared/validateWithSchema.js';
import rolesSchema from './roles.schema.js';

const createRole = validateWithSchema([
    { schema: rolesSchema.createRoleSchema, property: 'body' },
]);

const getRoles = validateWithSchema([
    {
        schema: rolesSchema.getRolesQuerySchema,
        property: 'query',
    },
]);

const getRole = validateWithSchema([
    {
        schema: rolesSchema.roleIdParamSchema,
        property: 'params',
    },
]);

const updateRole = validateWithSchema([
    {
        schema: rolesSchema.updateRoleSchema,
        property: 'body',
    },
]);

const deleteRoles = validateWithSchema([
    {
        schema: rolesSchema.roleIdsParamSchema,
        property: 'query',
    },
]);

const deleteRole = validateWithSchema([
    {
        schema: rolesSchema.roleIdParamSchema,
        property: 'params',
    },
]);

const rolesValidator = {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRoles,
    deleteRole,
};

export default rolesValidator;
