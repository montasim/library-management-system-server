import RolesModel from './roles.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';

const createRole = async (roleData) => {
    try {
        roleData.createdBy = 'Admin'; // Hardcoded for now, will be dynamic in future

        const newRole = await RolesModel.create(roleData);

        return {
            timeStamp: new Date(),
            success: true,
            data: newRole,
            message: 'Role created successfully.',
            status: httpStatus.CREATED,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the role.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getRoles = async (params) => {
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
        const totalRoles = await RolesModel.countDocuments(query);
        const totalPages = Math.ceil(totalRoles / limit);

        // Adjust the limit if it exceeds the total number of roles
        const adjustedLimit = Math.min(limit, totalRoles - (page - 1) * limit);

        const roles = await RolesModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit);

        return {
            timeStamp: new Date(),
            success: true,
            data: {
                roles,
                totalRoles,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            message: roles.length
                ? `${roles.length} roles fetched successfully.`
                : 'No roles found.',
            status: httpStatus.OK,
        };
    } catch (error) {
        logger.error('Error fetching roles:', error);

        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Failed to fetch roles.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const getRole = async (roleId) => {
    const role = await RolesModel.findById(roleId);

    if (!role) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Role not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: role,
        message: 'Role fetched successfully.',
        status: httpStatus.OK,
    };
};

const updateRole = async (roleId, updateData) => {
    updateData.updatedBy = 'Admin'; // Hardcoded for now, will be dynamic in future

    const updatedRole = await RolesModel.findByIdAndUpdate(roleId, updateData, {
        new: true,
    });

    if (!updatedRole) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Role not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: updatedRole,
        message: 'Role updated successfully.',
        status: httpStatus.OK,
    };
};

const deleteRoles = async (roleIds) => {
    const results = {
        deleted: [],
        notFound: [],
        failed: [],
    };

    // Process each roleId
    for (const roleId of roleIds) {
        try {
            const role = await RolesModel.findByIdAndDelete(roleId);
            if (role) {
                results.deleted.push(roleId);
            } else {
                results.notFound.push(roleId);
            }
        } catch (error) {
            // Log the error and mark this ID as failed
            logger.error(`Failed to delete role with ID ${roleId}: ${error}`);
            results.failed.push(roleId);
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

const deleteRole = async (roleId) => {
    const role = await RolesModel.findByIdAndDelete(roleId);

    if (!role) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Role not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Role deleted successfully.',
        status: httpStatus.OK,
    };
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
