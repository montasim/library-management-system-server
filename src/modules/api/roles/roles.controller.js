import entity from '../../../shared/entity.js';
import rolesService from './roles.service.js';

const rolesController = {
    createRole: entity.createEntity(rolesService, 'createRole'),
    createDefaultRole: entity.createEntity(rolesService, 'createDefaultRole'),
    getRoleList: entity.getEntityList(rolesService, 'getRoleList'),
    getRoleById: entity.getEntityById(rolesService, 'getRoleById'),
    updateRoleById: entity.updateEntityById(rolesService, 'updateRoleById'),
    deleteRoleById: entity.deleteEntityById(rolesService, 'deleteRoleById'),
    deleteRoleByList: entity.deleteEntityList(rolesService, 'deleteRoleList'),
};

export default rolesController;
