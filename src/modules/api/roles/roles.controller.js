import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import rolesService from './roles.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';
import getRequesterPermissions
    from '../../../utilities/getRequesterPermissions.js';

const createRole = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const availablePermissions = getRequesterPermissions(req);
    const newRoleData = await rolesService.createRole(requester, availablePermissions, req.body);

    newRoleData.route = req.originalUrl;

    res.status(newRoleData.status).send(newRoleData);
});

const createDefaultRole = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const availablePermissions = getRequesterPermissions(req);
    const newRoleData = await rolesService.createDefaultRole(requester, availablePermissions);

    newRoleData.route = req.originalUrl;

    res.status(newRoleData.status).send(newRoleData);
});

const getRoleList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const availablePermissions = getRequesterPermissions(req);
    const rolesData = await rolesService.getRoleList(requester, availablePermissions, req.query);

    rolesData.route = req.originalUrl;

    res.status(rolesData.status).send(rolesData);
});

const getRoleById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const availablePermissions = getRequesterPermissions(req);
    const roleData = await rolesService.getRoleById(requester, availablePermissions, req.params.roleId);

    roleData.route = req.originalUrl;

    res.status(roleData.status).send(roleData);
});

const updateRoleById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const availablePermissions = getRequesterPermissions(req);
    const updatedRoleData = await rolesService.updateRoleById(
        requester,
        availablePermissions,
        req.params.roleId,
        req.body
    );

    updatedRoleData.route = req.originalUrl;

    res.status(updatedRoleData.status).send(updatedRoleData);
});

const deleteRoleByList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const availablePermissions = getRequesterPermissions(req);
    const roleIds = req.query.ids.split(',');
    const deletedRolesData = await rolesService.deleteRoleByList(requester, availablePermissions, roleIds);

    deletedRolesData.route = req.originalUrl;

    res.status(deletedRolesData.status).send(deletedRolesData);
});

const deleteRoleById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const availablePermissions = getRequesterPermissions(req);
    const deletedRoleData = await rolesService.deleteRoleById(
        requester,
        availablePermissions,
        req.params.roleId
    );

    deletedRoleData.route = req.originalUrl;

    res.status(deletedRoleData.status).send(deletedRoleData);
});

const rolesController = {
    createRole,
    createDefaultRole,
    getRoleList,
    getRoleById,
    updateRoleById,
    deleteRoleByList,
    deleteRoleById,
};

export default rolesController;
