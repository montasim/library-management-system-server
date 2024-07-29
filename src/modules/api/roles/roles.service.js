import validatePermissions from '../../../shared/validatePermissions.js';
import RolesModel from './roles.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import sendResponse from '../../../utilities/sendResponse.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import PermissionsModel from '../permissions/permissions.model.js';
import constants from '../../../constant/constants.js';

const populateRoleFields = async (query) => {
    return await query
        .populate({
            path: 'permissions',
            populate: [
                // { path: 'createdBy', select: '-password -mustChangePassword -isEmailVerified -isPhoneVerified -emailVerifyToken -emailVerifyTokenExpires -phoneVerifyToken -phoneVerifyTokenExpires -resetPasswordVerifyToken -resetPasswordVerifyTokenExpires -login' },
                // { path: 'updatedBy', select: '-password -mustChangePassword -isEmailVerified -isPhoneVerified -emailVerifyToken -emailVerifyTokenExpires -phoneVerifyToken -phoneVerifyTokenExpires -resetPasswordVerifyToken -resetPasswordVerifyTokenExpires -login' },
                {
                    path: 'createdBy',
                    select: 'name image department designation isActive',
                },
                {
                    path: 'updatedBy',
                    select: 'name image department designation isActive',
                },
            ],
        })
        .populate({
            path: 'createdBy',
            select: 'name image department designation isActive',
        })
        .populate({
            path: 'updatedBy',
            select: 'name image department designation isActive',
        });
};

const createRole = async (requester, newRoleData) => {
    try {
        // Validate requester
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create role.',
                httpStatus.FORBIDDEN
            );
        }

        // Validate permissions
        const arePermissionsValid = await validatePermissions(
            newRoleData.permissions
        );
        if (!arePermissionsValid) {
            return errorResponse(
                'Invalid permissions provided.',
                httpStatus.BAD_REQUEST
            );
        }

        // Set createdBy field
        newRoleData.createdBy = requester;

        // Attempt to create the role, checking for existing role in the same operation if possible
        const newRole = await RolesModel.create(newRoleData).catch(err => {
            if (err.code === 11000) { // MongoDB duplicate key error on 'name'
                return errorResponse(
                    `Role name "${newRoleData.name}" already exists.`,
                    httpStatus.BAD_REQUEST
                );
            }

            throw err;
        });

        // Populate fields immediately upon creation if supported
        const populatedRole = await populateRoleFields(RolesModel.findById(newRole._id));

        // Successful response
        return sendResponse(
            populatedRole,
            'Role created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create role: ${error}`);

        return errorResponse(error.message || 'Failed to create role.', httpStatus.INTERNAL_SERVER_ERROR);
    }
};

const createDefaultRole = async (requester) => {
    try {
        // Validate requester's authorization
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse('You are not authorized to create role.', httpStatus.FORBIDDEN);
        }

        // Fetch all permissions IDs
        const allPermissions = await PermissionsModel.find({}, '_id'); // More efficient field selection
        const permissionsIds = allPermissions.map(permission => permission._id);

        // Upsert operation to either update the existing role or create a new one
        const updateResult = await RolesModel.updateOne(
            { name: constants.defaultName.adminRole },
            { $set: { permissions: permissionsIds, createdBy: requester } },
            { upsert: true, new: true } // Ensures that document is returned if it's an update
        );

        // Find the role to populate necessary fields
        const roleDetails = await populateRoleFields(RolesModel.findById(updateResult.upsertedId || updateResult._id));

        // BUG: if all the permissions is already added then always returns "Role updated successfully."
        // Determine the appropriate message based on whether the role was created or updated
        const message = updateResult.upsertedCount ? 'Role created successfully.' : 'Role updated successfully.';

        return sendResponse(
            roleDetails,
            message,
            updateResult.upsertedCount ? httpStatus.CREATED : httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to create or update role: ${error}`);

        return errorResponse(
            error.message || 'Failed to create or update role.',
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
        const roles = await populateRoleFields(
            RolesModel.find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
        );

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

const getRoleById = async (requester, roleId) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                `You are not authorized to view role.`,
                httpStatus.FORBIDDEN
            );
        }

        const resource = await populateRoleFields(
            RolesModel.findById(roleId)
        );
        if (!resource) {
            return errorResponse(`Role not found.`, httpStatus.NOT_FOUND);
        }

        return sendResponse(
            resource,
            `Role fetched successfully.`,
            httpStatus.OK
        );
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

        updateData.updatedBy = requester;

        // Attempt to update the role
        const updatedRole = await RolesModel.findByIdAndUpdate(
            roleId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedRole) {
            return sendResponse(
                {},
                'Role not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedPermission = await populateRoleFields(
            RolesModel.findById(updatedRole._id)
        );

        return sendResponse(
            populatedPermission,
            'Role updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        // Handle specific errors, like duplicate names, here
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return sendResponse(
                {},
                `Role name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

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
    createDefaultRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRoles,
    deleteRole,
};

export default rolesService;
