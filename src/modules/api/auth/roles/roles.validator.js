import validateWithSchema from '../../../../shared/validateWithSchema.js';
import rolesSchema from './roles.schema.js';

const createRole = validateWithSchema(rolesSchema.createRoleSchema, 'body');
const getRoles = validateWithSchema(rolesSchema.getRolesQuerySchema, 'query');
const getRole = validateWithSchema(rolesSchema.roleIdParamSchema, 'params');
const updateRole = validateWithSchema(rolesSchema.updateRoleSchema, 'body');
const deleteRoles = validateWithSchema(rolesSchema.roleIdsParamSchema, 'query');
const deleteRole = validateWithSchema(rolesSchema.roleIdParamSchema, 'params');

const rolesValidator = {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRoles,
    deleteRole,
};

export default rolesValidator;
