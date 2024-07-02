import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import rolesService from './roles.service.js';

const createRole = asyncErrorHandler(async (req, res) => {
    const newRoleData = await rolesService.createRole(req.body);

    newRoleData.route = req.originalUrl;

    res.status(newRoleData.status).send(newRoleData);
});

const getRoles = asyncErrorHandler(async (req, res) => {
    const rolesData = await rolesService.getRoles(req.query);

    rolesData.route = req.originalUrl;

    res.status(rolesData.status).send(rolesData);
});

const getRole = asyncErrorHandler(async (req, res) => {
    const roleData = await rolesService.getRole(req.params.roleId);

    roleData.route = req.originalUrl;

    res.status(roleData.status).send(roleData);
});

const updateRole = asyncErrorHandler(async (req, res) => {
    const updatedRoleData = await rolesService.updateRole(
        req.params.roleId,
        req.body
    );

    updatedRoleData.route = req.originalUrl;

    res.status(updatedRoleData.status).send(updatedRoleData);
});

const deleteRoles = asyncErrorHandler(async (req, res) => {
    const roleIds = req.query.ids.split(',');
    const deletedRolesData = await rolesService.deleteRoles(roleIds);

    deletedRolesData.route = req.originalUrl;

    res.status(deletedRolesData.status).send(deletedRolesData);
});

const deleteRole = asyncErrorHandler(async (req, res) => {
    const deletedRoleData = await rolesService.deleteRole(req.params.roleId);

    deletedRoleData.route = req.originalUrl;

    res.status(deletedRoleData.status).send(deletedRoleData);
});

const rolesController = {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRoles,
    deleteRole,
};

export default rolesController;