import PermissionsModel from './permissions.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import routesConstants from '../../../constant/routes.constants.js';
import generatePermissions from '../../../shared/generatePermissions.js';
import RolesModel from '../roles/roles.model.js';
import constants from '../../../constant/constants.js';
import service from '../../../shared/service.js';

const populatePermissionFields = async (query) => {
    return await query
        .populate({
            path: 'createdBy',
            select: 'name image department designation isActive',
        })
        .populate({
            path: 'updatedBy',
            select: 'name image department designation isActive',
        });
};

const permissionListParamsMapping = {};

const createPermission = async (requester, newPermissionData) => {
    try {
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

        // add new permission to the admin role
        const adminRoleDetails = await RolesModel.findOne({
            name: constants.defaultName.adminRole,
        }).lean();
        if (adminRoleDetails) {
            // Role exists, update it by adding the new permission
            await RolesModel.updateOne(
                { _id: adminRoleDetails._id },
                {
                    $addToSet: { permissions: newPermission._id },
                }
            );
        } else {
            // Role does not exist, create it with the new permission
            const newRole = new RolesModel({
                name: constants.defaultName.adminRole,
                permissions: [newPermission._id], // Use an array to initialize permissions
                createdBy: requester,
            });

            await newRole.save();
        }

        // Populate the necessary fields after creation
        const populatedPermission = await populatePermissionFields(
            PermissionsModel.findById(newPermission._id)
        );

        return sendResponse(
            populatedPermission,
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

const createDefaultPermissionList = async (requester) => {
    try {
        // Generate permissions
        const permissions = generatePermissions(routesConstants);
        const createdPermissions = [];
        const errors = [];

        // Fetch existing permissions in one call
        const existingPermissions = await PermissionsModel.find({
            name: { $in: permissions },
        })
            .lean()
            .select('name')
            .exec();

        const existingNames = new Set(existingPermissions.map((p) => p.name));

        const permissionsToCreate = permissions
            .filter((p) => !existingNames.has(p))
            .map((permissionName) => ({
                name: permissionName,
                isActive: true,
                createdBy: requester,
                updatedBy: requester, // Assuming the creator is initially also the updater
            }));

        if (permissionsToCreate.length > 0) {
            // Bulk insert new permissions
            const newPermissions =
                await PermissionsModel.insertMany(permissionsToCreate);

            // Optionally populate necessary fields after creation - this would still require individual fetches, but it's optional
            const populatedPermissions = await populatePermissionFields(
                PermissionsModel.find({
                    _id: { $in: newPermissions.map((p) => p._id) },
                })
            );

            createdPermissions.push(...populatedPermissions);
        }

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

const getPermissionList = async (requester, params) => {
    return service.getResourceList(PermissionsModel, populatePermissionFields, params, permissionListParamsMapping, 'permission');
};

const getPermissionById = async (permissionId) => {
    return service.getResourceById(PermissionsModel, populatePermissionFields, permissionId, 'Permission');
};

const updatePermissionById = async (requester, permissionId, updateData) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        // Attempt to update the permission
        const updatedPermission = await PermissionsModel.findByIdAndUpdate(
            permissionId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPermission) {
            return sendResponse(
                {},
                'Permission not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedPermission = await populatePermissionFields(
            PermissionsModel.findById(updatedPermission._id)
        );

        return sendResponse(
            populatedPermission,
            'Permission updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        // Handle specific errors, like duplicate names, here
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return sendResponse(
                {},
                `Permission name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        loggerService.error(`Failed to update permission: ${error}`);

        return errorResponse(
            error.message || 'Failed to update permission.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePermissionList = async (requester, permissionIds) => {
    return await service.deleteResourcesByList(requester, PermissionsModel, permissionIds, 'permission');
};

const deletePermissionById = async (requester, permissionId) => {
    return service.deleteResourceById(requester, PermissionsModel, permissionId, 'permission');
};

const permissionsService = {
    createPermission,
    createDefaultPermissionList,
    getPermissionList,
    getPermissionById,
    updatePermissionById,
    deletePermissionList,
    deletePermissionById,
};

export default permissionsService;
