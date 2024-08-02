import validatePermissions from '../../../shared/validatePermissions.js';
import RolesModel from './roles.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import PermissionsModel from '../permissions/permissions.model.js';
import constants from '../../../constant/constants.js';
import AdminActivityLoggerModel from '../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants from '../admin/adminActivityLogger/adminActivityLogger.constants.js';
import service from '../../../shared/service.js';

const populateRoleFields = async (query) => {
    return await query
        .populate({
            path: 'permissions',
            populate: [
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
        loggerService.info('Starting role creation process.');

        // Validate permissions in the role
        loggerService.debug('Validating the permissions of the new role.');
        const arePermissionsValid = await validatePermissions(
            newRoleData.permissions
        );
        if (!arePermissionsValid) {
            loggerService.warn('Validation of permissions failed.');
            return errorResponse(
                'Invalid permissions provided.',
                httpStatus.BAD_REQUEST
            );
        }

        // Set createdBy field
        newRoleData.createdBy = requester;

        loggerService.debug(`Set createdBy to requester: ${requester}`);

        // Attempt to create the role, checking for existing role in the same operation if possible
        loggerService.debug('Attempting to create the role.');
        const newRole = await RolesModel.create(newRoleData).catch((err) => {
            if (err.code === 11000) {
                // MongoDB duplicate key error on 'name'
                loggerService.error(
                    `Duplicate role name error: ${newRoleData.name}`
                );
                return errorResponse(
                    `Role name "${newRoleData.name}" already exists.`,
                    httpStatus.BAD_REQUEST
                );
            }

            loggerService.error('Error during role creation:', err);
            throw err;
        });

        loggerService.info(`Role created successfully: ${newRole}`);

        // Populate fields immediately upon creation if supported
        loggerService.debug('Populating role fields post-creation.');
        const populatedRole = await populateRoleFields(
            RolesModel.findById(newRole._id)
        );

        // Log the creation action
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: 'Created a new role',
            details: JSON.stringify(populatedRole),
            affectedId: newRole._id,
        });

        // Successful response
        return sendResponse(
            populatedRole,
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

const createDefaultRole = async (requester) => {
    try {
        // Fetch all permissions IDs
        const allPermissions = await PermissionsModel.find({}, '_id'); // More efficient field selection
        const permissionsIds = allPermissions.map(
            (permission) => permission._id
        );

        // Upsert operation to either update the existing role or create a new one
        const updateResult = await RolesModel.updateOne(
            { name: constants.defaultName.adminRole },
            { $set: { permissions: permissionsIds, createdBy: requester } },
            { upsert: true, new: true } // Ensures that document is returned if it's an update
        );

        // Find the role to populate necessary fields
        const roleDetails = await populateRoleFields(
            RolesModel.findById(updateResult.upsertedId || updateResult._id)
        );

        // Log the creation action; this could potentially be made asynchronous if it blocks critical processing
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: 'Created default role',
            details: JSON.stringify(roleDetails),
            affectedId: updateResult.upsertedId || updateResult._id,
        });

        // Handling the response message based on the operation result
        const message = updateResult.upsertedCount
            ? 'Role created successfully.'
            : 'Role updated successfully.';

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

const getRoleList = async (requester, params) => {
    try {
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

        // Log the fetched action; this could potentially be made asynchronous if it blocks critical processing
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.FETCH,
            description: 'Fetched role list',
            details: JSON.stringify(roles),
        });

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
        const resource = await populateRoleFields(RolesModel.findById(roleId));
        if (!resource) {
            return errorResponse(`Role not found.`, httpStatus.NOT_FOUND);
        }

        // Log the fetched action; this could potentially be made asynchronous if it blocks critical processing
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.FETCH,
            description: 'Fetched role list',
            details: JSON.stringify(resource),
        });

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

const updateRoleById = async (requester, roleId, updateData) => {
    try {
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
            return sendResponse({}, 'Role not found.', httpStatus.NOT_FOUND);
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedRole = await populateRoleFields(
            RolesModel.findById(updatedRole._id)
        );

        // Log the update action
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: 'Role updated',
            details: JSON.stringify(populatedRole),
            affectedId: updatedRole._id,
        });

        return sendResponse(
            populatedRole,
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

const deleteRoleByList = async (requester, roleIds) => {
    try {
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

        // Log the delete action
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: message,
            details: JSON.stringify(deletionResult),
        });

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

const deleteRoleById = async (requester, roleId) => {
    return service.deleteResourceById(requester, RolesModel, roleId, 'role');
};

const rolesService = {
    createRole,
    createDefaultRole,
    getRoleList,
    getRoleById,
    updateRoleById,
    deleteRoleByList,
    deleteRoleById,
};

export default rolesService;
