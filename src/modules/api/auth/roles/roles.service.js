import validatePermissions from '../../../../shared/validatePermissions.js';
import RolesModel from './roles.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import errorResponse from '../../../../utilities/errorResponse.js';
import validateUserRequest from '../../../../utilities/validateUserRequest.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import PermissionsModel from '../permissions/permissions.model.js';

const createRole = async (requester, newRoleData) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to create role.',
            httpStatus.FORBIDDEN
        );
    }

    const oldDetails = await RolesModel.findOne({ name: newRoleData.name }).lean();
    if (oldDetails) {
        return errorResponse(`Role name "${newRoleData.name}" already exists.`, httpStatus.BAD_REQUEST);
    }

    const arePermissionsValid = await validatePermissions(newRoleData.permissions);
    if (!arePermissionsValid) {
        return errorResponse('Invalid permissions provided.', httpStatus.BAD_REQUEST);
    }

    newRoleData.createdBy = requester;

    const newRole = await RolesModel.create(newRoleData);

    return sendResponse(newRole, 'Role created successfully.', httpStatus.CREATED);
};

const getRoles = async (requester, params) => {
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
        return sendResponse(
            {}, 'No roles found.', httpStatus.NOT_FOUND);
    }

    return sendResponse({
        roles,
        totalRoles,
        totalPages,
        currentPage: page,
        pageSize: limit,
        sort,
    }, `${roles.length} roles fetched successfully.`, httpStatus.OK);
};

const getRole = async (requester, roleId) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to create role.',
            httpStatus.FORBIDDEN
        );
    }

    const role = await RolesModel.findById(roleId);
    if (!role) {
        return errorResponse('Role not found.', httpStatus.NOT_FOUND);
    }

    return sendResponse(role, 'Role fetched successfully.', httpStatus.OK);
};

const updateRole = async (requester, roleId, updateData) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to update permissions.',
            httpStatus.FORBIDDEN
        );
    }

    updateData.updatedBy = requester;

    const updatedRole = await RolesModel.findByIdAndUpdate(
        roleId,
        updateData,
        { new: true}
    );

    if (!updatedRole) {
        return sendResponse({}, 'Role not found.', httpStatus.NOT_FOUND);
    }

    return sendResponse(updatedRole, 'Role updated successfully.', httpStatus.OK);
};

const deleteRoles = async (requester, roleIds) => {
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
};

const deleteRole = async (requester, roleId) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            'You are not authorized to delete role.',
            httpStatus.FORBIDDEN
        );
    }

    const deletedRole =
        await PermissionsModel.findByIdAndDelete(roleId);
    if (!deletedRole) {
        return sendResponse({}, 'Role not found.', httpStatus.NOT_FOUND);
    }

    return sendResponse({}, 'Role deleted successfully.', httpStatus.OK);
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
