import PermissionsModel from '../modules/api/permissions/permissions.model.js';
import loggerService from '../service/logger.service.js';

const validatePermission = async (availablePermissions, requiredPermission) => {
    try {
        // Get the requiredPermission from the PermissionsModel asynchronously
        const validateRequiredPermission = await PermissionsModel.findOne({ name: requiredPermission }).lean();

        // If the requiredPermission does not exist in the PermissionsModel, return false
        if (!validateRequiredPermission) {
            return false;
        }

        // Check if the requiredPermission is in the availablePermissions
        return availablePermissions.includes(requiredPermission);
    } catch (error) {
        loggerService.error('Error checking permissions:', error);

        return false;
    }
};

export default validatePermission;
