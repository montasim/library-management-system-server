import entity from '../../../shared/entity.js';
import permissionsService from './permissions.service.js';
import routesConstants from '../../../constant/routes.constants.js';

const permissionsController = {
    createPermission: entity.createEntity(permissionsService.createPermission),
    createDefaultPermissionList: entity.createEntity(permissionsService, 'createDefaultPermissionList'),
    getPermissionList: entity.getEntityList(permissionsService, 'getPermissionList'),
    getPermissionById: entity.getEntityById(permissionsService, 'getPermissionById', routesConstants.permissions.params),
    updatePermissionById: entity.updateEntityById(permissionsService, 'updatePermissionById', routesConstants.permissions.params),
    deletePermissionById: entity.deleteEntityById(permissionsService, 'deletePermissionById', routesConstants.permissions.params),
    deletePermissionList: entity.deleteEntityList(permissionsService, 'deletePermissionList'),
};

export default permissionsController;
