import PermissionsModel from '../modules/api/permissions/permissions.model.js';
import loggerService from '../service/logger.service.js';
import RolesModel from '../modules/api/roles/roles.model.js';

const validatePermission = async (designation, requiredPermission) => {
    try {
        loggerService.info(`Validating permission for role: ${designation}`);

        // Asynchronously find the role by ID and populate the permissions details
        const roleWithPermissions = await RolesModel.findById(
            designation,
            'permissions'
        )
            .populate({
                path: 'permissions',
                select: 'name -_id',
            })
            .lean();

        if (!roleWithPermissions || !roleWithPermissions.permissions) {
            loggerService.warn(`No permissions found for role: ${designation}`);

            return false;
        }

        // Extract only the names of the permissions from the populated documents
        const availablePermissionNames = roleWithPermissions.permissions.map(
            (perm) => perm.name
        );
        loggerService.info(
            `Permissions available for role ${designation}: ${availablePermissionNames.join(', ')}`
        );

        // Get the requiredPermission from the PermissionsModel asynchronously
        const validateRequiredPermission = await PermissionsModel.findOne({
            name: requiredPermission,
        }).lean();

        // If the requiredPermission does not exist in the PermissionsModel, return false
        if (!validateRequiredPermission) {
            loggerService.warn(
                `Required permission not found: ${requiredPermission}`
            );

            return false;
        }

        // Check if the requiredPermission is in the availablePermissionNames
        const hasPermission =
            availablePermissionNames.includes(requiredPermission);
        loggerService.info(
            `Permission ${requiredPermission} for role ${designation} validation result: ${hasPermission}`
        );
        return hasPermission;
    } catch (error) {
        loggerService.error('Error checking permissions:', error);

        return false;
    }
};

export default validatePermission;
