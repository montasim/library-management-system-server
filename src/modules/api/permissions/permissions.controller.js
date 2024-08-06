import controller from '../../../shared/controller.js';
import permissionsService from './permissions.service.js';
import routesConstants from '../../../constant/routes.constants.js';

const permissionsController = {
    createPermission: controller.create(permissionsService.createPermission),
    createDefaultPermissionList: controller.create(
        permissionsService,
        'createDefaultPermissionList'
    ),
    getPermissionList: controller.getList(
        permissionsService,
        'getPermissionList'
    ),
    getPermissionById: controller.getById(
        permissionsService,
        'getPermissionById',
        routesConstants.permissions.params
    ),
    updatePermissionById: controller.updateById(
        permissionsService,
        'updatePermissionById',
        routesConstants.permissions.params
    ),
    deletePermissionById: controller.deleteById(
        permissionsService,
        'deletePermissionById',
        routesConstants.permissions.params
    ),
    deletePermissionList: controller.deleteList(
        permissionsService,
        'deletePermissionList'
    ),
};

export default permissionsController;
