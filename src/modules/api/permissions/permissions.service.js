import PermissionsModel from './permissions.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';

const createPermission = async (permissionData) => {
    try {
        const oldDetails = await PermissionsModel.findOne({
            name: permissionData.name,
        }).lean();

        if (oldDetails) {
            throw new Error(
                `Permission name "${permissionData.name}" already exists.`
            );
        }

        permissionData.createdBy = 'Admin'; // Hardcoded for now, will be dynamic in future

        const newPermission = await PermissionsModel.create(permissionData);

        return {
            timeStamp: new Date(),
            success: true,
            data: newPermission,
            message: 'Permission created successfully.',
            status: httpStatus.CREATED,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the permission.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getPermissions = async (params) => {
    const {
        page = 1,
        limit = 10,
        sort = '-createdAt', // Default sort by most recent creation
        name,
        createdBy,
        updatedBy,
        ...otherFilters
    } = params;

    const query = {};

    // Constructing query filters based on parameters
    if (name) query.name = { $regex: name, $options: 'i' };
    if (createdBy) query.createdBy = { $regex: createdBy, $options: 'i' };
    if (updatedBy) query.updatedBy = { $regex: updatedBy, $options: 'i' };

    try {
        const totalPermissions = await PermissionsModel.countDocuments(query);
        const totalPages = Math.ceil(totalPermissions / limit);

        // Adjust the limit if it exceeds the total number of permissions
        const adjustedLimit = Math.min(
            limit,
            totalPermissions - (page - 1) * limit
        );

        const permissions = await PermissionsModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit);

        return {
            timeStamp: new Date(),
            success: true,
            data: {
                permissions,
                totalPermissions,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            message: permissions.length
                ? `${permissions.length} permissions fetched successfully.`
                : 'No permissions found.',
            status: httpStatus.OK,
        };
    } catch (error) {
        logger.error('Error fetching permissions:', error);

        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Failed to fetch permissions.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const getPermission = async (permissionId) => {
    const permission = await PermissionsModel.findById(permissionId);

    if (!permission) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Permission not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: permission,
        message: 'Permission fetched successfully.',
        status: httpStatus.OK,
    };
};

const updatePermission = async (permissionId, updateData) => {
    updateData.updatedBy = 'Admin'; // Hardcoded for now, will be dynamic in future

    const updatedPermission = await PermissionsModel.findByIdAndUpdate(
        permissionId,
        updateData,
        {
            new: true,
        }
    );

    if (!updatedPermission) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Permission not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: updatedPermission,
        message: 'Permission updated successfully.',
        status: httpStatus.OK,
    };
};

const deletePermissions = async (permissionIds) => {
    const results = {
        deleted: [],
        notFound: [],
        failed: [],
    };

    // Process each permissionId
    for (const permissionId of permissionIds) {
        try {
            const permission =
                await PermissionsModel.findByIdAndDelete(permissionId);
            if (permission) {
                results.deleted.push(permissionId);
            } else {
                results.notFound.push(permissionId);
            }
        } catch (error) {
            // Log the error and mark this ID as failed
            logger.error(
                `Failed to delete permission with ID ${permissionId}: ${error}`
            );
            results.failed.push(permissionId);
        }
    }

    return {
        timeStamp: new Date(),
        success: results.failed.length === 0, // Success only if there were no failures
        data: results,
        message: `Deleted ${results.deleted.length}, Not found ${results.notFound.length}, Failed ${results.failed.length}`,
        status: httpStatus.OK,
    };
};

const deletePermission = async (permissionId) => {
    const permission = await PermissionsModel.findByIdAndDelete(permissionId);

    if (!permission) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Permission not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Permission deleted successfully.',
        status: httpStatus.OK,
    };
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
