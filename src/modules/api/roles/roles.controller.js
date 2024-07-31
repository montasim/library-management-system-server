import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import rolesService from './roles.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createRole = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newRoleData = await rolesService.createRole(requester, req.body);

    newRoleData.route = req.originalUrl;

    res.status(newRoleData.status).send(newRoleData);
});

const createDefaultRole = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newRoleData = await rolesService.createDefaultRole(requester);

    newRoleData.route = req.originalUrl;

    res.status(newRoleData.status).send(newRoleData);
});

const getRoleList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const rolesData = await rolesService.getRoleList(requester, req.query);

    rolesData.route = req.originalUrl;

    res.status(rolesData.status).send(rolesData);
});

const getRoleById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const roleData = await rolesService.getRoleById(
        requester,
        req.params.roleId
    );

    roleData.route = req.originalUrl;

    res.status(roleData.status).send(roleData);
});

const updateRoleById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedRoleData = await rolesService.updateRoleById(
        requester,
        req.params.roleId,
        req.body
    );

    updatedRoleData.route = req.originalUrl;

    res.status(updatedRoleData.status).send(updatedRoleData);
});

const deleteRoleByList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const roleIds = req.query.ids.split(',');
    const deletedRolesData = await rolesService.deleteRoleByList(
        requester,
        roleIds
    );

    deletedRolesData.route = req.originalUrl;

    res.status(deletedRolesData.status).send(deletedRolesData);
});

const deleteRoleById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedRoleData = await rolesService.deleteRoleById(
        requester,
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
