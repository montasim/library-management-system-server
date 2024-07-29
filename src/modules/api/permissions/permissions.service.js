import PermissionsModel from './permissions.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import getResourceById from '../../../shared/getResourceById.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import routesConstants from '../../../constant/routes.constants.js';
import generatePermissions from '../../../shared/generatePermissions.js';

const createPermission = async (requester, newPermissionData) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create permissions.',
                httpStatus.FORBIDDEN
            );
        }

        const exists = await PermissionsModel.exists({
            name: newPermissionData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Permission name "${newPermissionData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        newPermissionData.createdBy = requester;

        const newPermission = await PermissionsModel.create(newPermissionData);

        return sendResponse(
            newPermission,
            'Permission created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create permission: ${error}`);

        return errorResponse(
            error.message || 'Failed to create permission.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const createDefaultPermission = async (requester) => {
    try {
        // Validate user authorization
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            loggerService.warn(
                `Unauthorized permission creation attempt by user ${requester._id}`
            );

            return errorResponse(
                'You are not authorized to create permissions.',
                httpStatus.FORBIDDEN
            );
        }

        // Define actions and generate permissions
        const actions = ['create', 'get', 'update', 'delete', 'modify'];
        const permissions = generatePermissions(actions, routesConstants);
        const createdPermissions = [];
        const errors = [];

        for (const permissionName of permissions) {
            try {
                // Check if the permission already exists to prevent duplicates
                const existingPermission = await PermissionsModel.findOne({
                    name: permissionName,
                }).lean();
                if (!existingPermission) {
                    // Create and save the new permission if it does not exist
                    const newPermission = new PermissionsModel({
                        name: permissionName,
                        isActive: true,
                        createdBy: requester,
                    });

                    await newPermission.save();

                    createdPermissions.push(newPermission);

                    loggerService.info(
                        `Created new permission: ${permissionName}`
                    );
                } else {
                    loggerService.info(
                        `Permission already exists and was not created: ${permissionName}`
                    );
                }
            } catch (error) {
                errors.push({ permissionName, error: error.message });

                loggerService.error(
                    `Error creating permission ${permissionName}: ${error.message}`
                );
            }
        }

        // Construct the response with details of created permissions and any errors
        const message = `Permissions creation process completed with ${createdPermissions.length} permissions created.`;
        if (errors.length) {
            message += ` There were errors with ${errors.length} permissions.`;
        }

        return sendResponse(
            {
                createdPermissions,
                errors,
            },
            message,
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create permissions: ${error.message}`);

        return errorResponse(
            'Failed to create permissions due to an internal server error.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPermissions = async (requester, params) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to view permissions.',
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
        const totalPermissions = await PermissionsModel.countDocuments(query);
        const totalPages = Math.ceil(totalPermissions / limit);
        const permissions = await PermissionsModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!permissions.length) {
            return sendResponse(
                {},
                'No permissions found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                permissions,
                totalPermissions,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${permissions.length} permissions fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get permission: ${error}`);

        return errorResponse(
            error.message || 'Failed to get permission.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPermission = async (requester, permissionId) => {
    try {
        return getResourceById(
            requester,
            permissionId,
            PermissionsModel,
            'permission'
        );
    } catch (error) {
        loggerService.error(`Failed to get permission: ${error}`);

        return errorResponse(
            error.message || 'Failed to get permission.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updatePermission = async (requester, permissionId, updateData) => {
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

        const exists = await PermissionsModel.exists({
            name: updateData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Permission name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        const updatedPermission = await PermissionsModel.findByIdAndUpdate(
            permissionId,
            updateData,
            { new: true }
        );
        if (!updatedPermission) {
            return sendResponse(
                {},
                'Permission not found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            updatedPermission,
            'Permission updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update permission: ${error}`);

        return errorResponse(
            error.message || 'Failed to update permission.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePermissions = async (requester, permissionIds) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to delete permissions.',
                httpStatus.FORBIDDEN
            );
        }

        // First, check which permissions exist
        const existingPermissions = await PermissionsModel.find({
            _id: { $in: permissionIds },
        })
            .select('_id')
            .lean();

        const existingIds = existingPermissions.map((p) => p._id.toString());
        const notFoundIds = permissionIds.filter(
            (id) => !existingIds.includes(id)
        );

        // Perform deletion on existing permissions only
        const deletionResult = await PermissionsModel.deleteMany({
            _id: { $in: existingIds },
        });

        const results = {
            deleted: deletionResult.deletedCount,
            notFound: notFoundIds.length,
            failed:
                permissionIds.length -
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
        loggerService.error(`Failed to delete permissions: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete permissions.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePermission = async (requester, permissionId) => {
    try {
        return deleteResourceById(
            requester,
            permissionId,
            PermissionsModel,
            'permission'
        );
    } catch (error) {
        loggerService.error(`Failed to delete permission: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete permission.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const permissionsService = {
    createPermission,
    createDefaultPermission,
    getPermissions,
    getPermission,
    updatePermission,
    deletePermissions,
    deletePermission,
};

export default permissionsService;
