import entity from '../../../shared/entity.js';
import permissionsService from './permissions.service.js';

const permissionsController = {
    createPermission: entity.createEntity(permissionsService.createPermission),
    createDefaultPermissionList: entity.createEntity(permissionsService, 'createDefaultPermissionList'),
    getPermissionList: entity.getEntityList(permissionsService, 'getPermissionList'),
    getPermissionById: entity.getEntityById(permissionsService, 'getPermissionById'),
    updatePermissionById: entity.updateEntityById(permissionsService, 'updatePermissionById'),
    deletePermissionById: entity.deleteEntityById(permissionsService, 'deletePermissionById'),
    deletePermissionList: entity.deleteEntityList(permissionsService, 'deletePermissionList'),
};

export default permissionsController;
