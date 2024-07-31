import entity from '../../../shared/entity.js';
import rolesService from './roles.service.js';
import routesConstants from '../../../constant/routes.constants.js';

const rolesController = {
    createRole: entity.createEntity(rolesService, 'createRole'),
    createDefaultRole: entity.createEntity(rolesService, 'createDefaultRole'),
    getRoleList: entity.getEntityList(rolesService, 'getRoleList'),
    getRoleById: entity.getEntityById(
        rolesService,
        'getRoleById',
        routesConstants.roles.params
    ),
    updateRoleById: entity.updateEntityById(
        rolesService,
        'updateRoleById',
        routesConstants.roles.params
    ),
    deleteRoleById: entity.deleteEntityById(
        rolesService,
        'deleteRoleById',
        routesConstants.roles.params
    ),
    deleteRoleByList: entity.deleteEntityList(rolesService, 'deleteRoleList'),
};

export default rolesController;
