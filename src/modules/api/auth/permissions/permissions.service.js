import PermissionsModel from './permissions.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import logger from '../../../../utilities/logger.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import deleteResourceById from '../../../../shared/deleteResourceById.js';
import getResourceById from '../../../../shared/getResourceById.js';

// Centralized permission fetching with error handling
const fetchPermissionById = async (permissionId) => {
    try {
        return await PermissionsModel.findById(permissionId);
    } catch (error) {
        logger.error(
            `Error fetching permission with ID ${permissionId}: ${error}`
        );

        throw new Error('Error fetching permission details.');
    }
};

const createPermission = async (requester, newPermissionData) => {
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
};

const getPermissions = async (requester, params) => {
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
            {}, 'No permissions found.', httpStatus.NOT_FOUND);
    }

    return sendResponse({
        permissions,
        totalPermissions,
        totalPages,
        currentPage: page,
        pageSize: limit,
        sort,
    }, `${roles.length} permissions fetched successfully.`, httpStatus.OK);
};

const getPermission = async (requester, permissionId) => {
    return getResourceById(requester, permissionId, PermissionsModel, 'permission');
};

const updatePermission = async (requester, permissionId, updateData) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to update permissions.',
            httpStatus.FORBIDDEN
        );
    }

    updateData.updatedBy = requester;

    const updatedPermission = await PermissionsModel.findByIdAndUpdate(
        permissionId,
        updateData,
        { new: true }
    );
    if (!updatedPermission) {
        return sendResponse({}, 'Permission not found.', httpStatus.NOT_FOUND);
    }

    return sendResponse(
        updatedPermission,
        'Permission updated successfully.',
        httpStatus.OK
    );
};

const deletePermissions = async (requester, permissionIds) => {
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
    const notFoundIds = permissionIds.filter((id) => !existingIds.includes(id));

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
};

const deletePermission = async (requester, permissionId) => {
    return deleteResourceById(requester, permissionId, PermissionsModel, 'permission');
};

const permissionsService = {
    createPermission,
    getPermissions,
    getPermission,
    updatePermission,
    deletePermissions,
    deletePermission,
};

export default permissionsService;
