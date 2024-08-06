import controller from '../../../shared/controller.js';
import rolesService from './roles.service.js';
import routesConstants from '../../../constant/routes.constants.js';

const rolesController = {
    createRole: controller.create(rolesService, 'createRole'),
    createDefaultRole: controller.create(rolesService, 'createDefaultRole'),
    getRoleList: controller.getList(rolesService, 'getRoleList'),
    getRoleById: controller.getById(
        rolesService,
        'getRoleById',
        routesConstants.roles.params
    ),
    updateRoleById: controller.updateById(
        rolesService,
        'updateRoleById',
        routesConstants.roles.params
    ),
    deleteRoleById: controller.deleteById(
        rolesService,
        'deleteRoleById',
        routesConstants.roles.params
    ),
    deleteRoleByList: controller.deleteList(rolesService, 'deleteRoleList'),
};

export default rolesController;
