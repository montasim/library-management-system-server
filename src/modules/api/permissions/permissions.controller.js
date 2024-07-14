import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import permissionsService from './permissions.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createPermission = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const newPermissionData = await permissionsService.createPermission(
        requester,
        req.body
    );

    newPermissionData.route = req.originalUrl;

    res.status(newPermissionData.status).send(newPermissionData);
});

const getPermissions = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const permissionsData = await permissionsService.getPermissions(
        requester,
        req.query
    );

    permissionsData.route = req.originalUrl;

    res.status(permissionsData.status).send(permissionsData);
});

const getPermission = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const permissionData = await permissionsService.getPermission(
        requester,
        req.params.permissionId
    );

    permissionData.route = req.originalUrl;

    res.status(permissionData.status).send(permissionData);
});

const updatePermission = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedPermissionData = await permissionsService.updatePermission(
        requester,
        req.params.permissionId,
        req.body
    );

    updatedPermissionData.route = req.originalUrl;

    res.status(updatedPermissionData.status).send(updatedPermissionData);
});

const deletePermissions = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const permissionIds = req.query.ids.split(',');
    const deletedPermissionsData = await permissionsService.deletePermissions(
        requester,
        permissionIds
    );

    deletedPermissionsData.route = req.originalUrl;

    res.status(deletedPermissionsData.status).send(deletedPermissionsData);
});

const deletePermission = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedPermissionData = await permissionsService.deletePermission(
        requester,
        req.params.permissionId
    );

    deletedPermissionData.route = req.originalUrl;

    res.status(deletedPermissionData.status).send(deletedPermissionData);
});

const permissionsController = {
    createPermission,
    getPermissions,
    getPermission,
    updatePermission,
    deletePermissions,
    deletePermission,
};

export default permissionsController;
