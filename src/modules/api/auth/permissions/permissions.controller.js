import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import permissionsService from './permissions.service.js';

const createPermission = asyncErrorHandler(async (req, res) => {
    const newPermissionData = await permissionsService.createPermission(
        req.body
    );

    newPermissionData.route = req.originalUrl;

    res.status(newPermissionData.status).send(newPermissionData);
});

const getPermissions = asyncErrorHandler(async (req, res) => {
    const permissionsData = await permissionsService.getPermissions(req.query);

    permissionsData.route = req.originalUrl;

    res.status(permissionsData.status).send(permissionsData);
});

const getPermission = asyncErrorHandler(async (req, res) => {
    const permissionData = await permissionsService.getPermission(
        req.params.permissionId
    );

    permissionData.route = req.originalUrl;

    res.status(permissionData.status).send(permissionData);
});

const updatePermission = asyncErrorHandler(async (req, res) => {
    const updatedPermissionData = await permissionsService.updatePermission(
        req.params.permissionId,
        req.body
    );

    updatedPermissionData.route = req.originalUrl;

    res.status(updatedPermissionData.status).send(updatedPermissionData);
});

const deletePermissions = asyncErrorHandler(async (req, res) => {
    const permissionIds = req.query.ids.split(',');
    const deletedPermissionsData =
        await permissionsService.deletePermissions(permissionIds);

    deletedPermissionsData.route = req.originalUrl;

    res.status(deletedPermissionsData.status).send(deletedPermissionsData);
});

const deletePermission = asyncErrorHandler(async (req, res) => {
    const deletedPermissionData = await permissionsService.deletePermission(
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
