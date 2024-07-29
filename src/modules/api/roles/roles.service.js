import validatePermissions from '../../../shared/validatePermissions.js';
import RolesModel from './roles.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import sendResponse from '../../../utilities/sendResponse.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import getResourceById from '../../../shared/getResourceById.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';

const createRole = async (requester, newRoleData) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create role.',
                httpStatus.FORBIDDEN
            );
        }

        const oldDetails = await RolesModel.findOne({
            name: newRoleData.name,
        }).lean();
        if (oldDetails) {
            return errorResponse(
                `Role name "${newRoleData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        const arePermissionsValid = await validatePermissions(
            newRoleData.permissions
        );
        if (!arePermissionsValid) {
            return errorResponse(
                'Invalid permissions provided.',
                httpStatus.BAD_REQUEST
            );
        }

        newRoleData.createdBy = requester;

        const newRole = await RolesModel.create(newRoleData);

        return sendResponse(
            newRole,
            'Role created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create role: ${error}`);

        return errorResponse(
            error.message || 'Failed to create role.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getRoles = async (requester, params) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create role.',
                httpStatus.FORBIDDEN
            );
        }

        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            name,
            createdBy,
            updatedBy,
            createdAt,
            updatedAt,
        } = params;
        const query = {
            ...(name && { name: new RegExp(name, 'i') }),
            ...(createdBy && { createdBy }),
            ...(updatedBy && { updatedBy }),
            ...(createdAt && { createdAt }),
            ...(updatedAt && { updatedAt }),
        };

        const totalRoles = await RolesModel.countDocuments(query);
        const totalPages = Math.ceil(totalRoles / limit);
        const roles = await RolesModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!roles.length) {
            return sendResponse({}, 'No roles found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            {
                roles,
                totalRoles,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${roles.length} roles fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get roles: ${error}`);

        return errorResponse(
            error.message || 'Failed to get roles.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getRole = async (requester, roleId) => {
    try {
        return getResourceById(requester, roleId, RolesModel, 'role');
    } catch (error) {
        loggerService.error(`Failed to get role: ${error}`);

        return errorResponse(
            error.message || 'Failed to get role.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updateRole = async (requester, roleId, updateData) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to update permissions.',
                httpStatus.FORBIDDEN
            );
        }

        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        const oldDetails = await RolesModel.findOne({
            name: updateData.name,
        }).lean();
        if (oldDetails) {
            return errorResponse(
                `Role name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        const updatedRole = await RolesModel.findByIdAndUpdate(
            roleId,
            updateData,
            {
                new: true,
            }
        );

        if (!updatedRole) {
            return sendResponse({}, 'Role not found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            updatedRole,
            'Role updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update role: ${error}`);

        return errorResponse(
            error.message || 'Failed to update role.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteRoles = async (requester, roleIds) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to delete role.',
                httpStatus.FORBIDDEN
            );
        }

        // First, check which permissions exist
        const existingPermissions = await RolesModel.find({
            _id: { $in: roleIds },
        })
            .select('_id')
            .lean();

        const existingIds = existingPermissions.map((p) => p._id.toString());
        const notFoundIds = roleIds.filter((id) => !existingIds.includes(id));

        // Perform deletion on existing permissions only
        const deletionResult = await RolesModel.deleteMany({
            _id: { $in: existingIds },
        });

        const results = {
            deleted: deletionResult.deletedCount,
            notFound: notFoundIds.length,
            failed:
                roleIds.length -
                deletionResult.deletedCount -
                notFoundIds.length,
        };

        // Custom message to summarize the outcome
        const message = `Deleted ${results.deleted}: Not found ${results.notFound}, Failed ${results.failed}`;

        if (results.deleted <= 0) {
            return errorResponse(message, httpStatus.OK);
        }

        return sendResponse({}, message, httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to delete roles: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete roles.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteRole = async (requester, roleId) => {
    try {
        return deleteResourceById(requester, roleId, RolesModel, 'role');
    } catch (error) {
        loggerService.error(`Failed to delete role: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete role.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const rolesService = {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRoles,
    deleteRole,
};

export default rolesService;
