import validateWithSchema from '../../../shared/validateWithSchema.js';
import rolesSchema from './roles.schema.js';

const createRole = validateWithSchema([
    { schema: rolesSchema.createRoleSchema, property: 'body' },
]);

const getRoleList = validateWithSchema([
    {
        schema: rolesSchema.getRolesQuerySchema,
        property: 'query',
    },
]);

const getRoleById = validateWithSchema([
    {
        schema: rolesSchema.roleIdParamSchema,
        property: 'params',
    },
]);

const updateRoleById = validateWithSchema([
    {
        schema: rolesSchema.roleIdParamSchema,
        property: 'params',
    },
    {
        schema: rolesSchema.updateRoleSchema,
        property: 'body',
    },
]);

const deleteRoleByList = validateWithSchema([
    {
        schema: rolesSchema.roleIdsParamSchema,
        property: 'query',
    },
]);

const deleteRoleById = validateWithSchema([
    {
        schema: rolesSchema.roleIdParamSchema,
        property: 'params',
    },
]);

const rolesValidator = {
    createRole,
    getRoleList,
    getRoleById,
    updateRoleById,
    deleteRoleByList,
    deleteRoleById,
};

export default rolesValidator;
