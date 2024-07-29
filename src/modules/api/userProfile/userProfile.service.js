import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import loggerService from '../../../service/logger.service.js';
import UsersModel from '../users/users.model.js';
import sendResponse from '../../../utilities/sendResponse.js';
import privacySettingsRules from '../privacySettings/privacySettings.rules.js';

const getProfile = async (username) => {
    try {
        // Retrieve the user's privacy settings first to determine allowed fields
        const userWithSettings = await UsersModel.findOne({ username: username }, 'privacySettings').lean();

        if (!userWithSettings || !userWithSettings.privacySettings) {
            return errorResponse('Privacy settings not found or user does not exist.', httpStatus.NOT_FOUND);
        }

        const visibilitySetting = userWithSettings.privacySettings.profileVisibility;
        const accessibleFields = privacySettingsRules[visibilitySetting.toUpperCase()] || [];

        // Prepare the projection object with `_id` explicitly set to 0 to exclude it unless needed
        let projection = { _id: 0 };
        accessibleFields.forEach(field => {
            projection[field] = 1;  // Include these fields
        });

        // Now, fetch the user details as per the privacy settings
        const user = await UsersModel.findOne({ username: username }, projection).lean();

        if (!user) {
            return errorResponse('User not found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            user,
            'User profile fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to retrieve user profile: ${error}`);
        return errorResponse(
            error.message || 'Failed to retrieve user profile.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const userProfileService = {
    getProfile,
};

export default userProfileService;
