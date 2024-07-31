import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import permissionsService from './permissions.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createPermission = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newPermissionData = await permissionsService.createPermission(
        requester,
        req.body
    );

    newPermissionData.route = req.originalUrl;

    res.status(newPermissionData.status).send(newPermissionData);
});

const createDefaultPermissionList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newPermissionData =
        await permissionsService.createDefaultPermissionList(requester);

    newPermissionData.route = req.originalUrl;

    res.status(newPermissionData.status).send(newPermissionData);
});

const getPermissionList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const permissionsData = await permissionsService.getPermissionList(
        requester,
        req.query
    );

    permissionsData.route = req.originalUrl;

    res.status(permissionsData.status).send(permissionsData);
});

const getPermissionById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const permissionData = await permissionsService.getPermissionById(
        requester,
        req.params.permissionId
    );

    permissionData.route = req.originalUrl;

    res.status(permissionData.status).send(permissionData);
});

const updatePermissionById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedPermissionData = await permissionsService.updatePermissionById(
        requester,
        req.params.permissionId,
        req.body
    );

    updatedPermissionData.route = req.originalUrl;

    res.status(updatedPermissionData.status).send(updatedPermissionData);
});

const deletePermissionList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const permissionIds = req.query.ids.split(',');
    const deletedPermissionsData = await permissionsService.deletePermissionList(
        requester,
        permissionIds
    );

    deletedPermissionsData.route = req.originalUrl;

    res.status(deletedPermissionsData.status).send(deletedPermissionsData);
});

const deletePermissionById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedPermissionData = await permissionsService.deletePermissionById(
        requester,
        req.params.permissionId
    );

    deletedPermissionData.route = req.originalUrl;

    res.status(deletedPermissionData.status).send(deletedPermissionData);
});

const permissionsController = {
    createPermission,
    createDefaultPermissionList,
    getPermissionList,
    getPermissionById,
    updatePermissionById,
    deletePermissionList,
    deletePermissionById,
};

export default permissionsController;
