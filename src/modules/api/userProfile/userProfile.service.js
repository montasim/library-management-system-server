import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import loggerService from '../../../service/logger.service.js';
import UsersModel from '../users/users.model.js';
import sendResponse from '../../../utilities/sendResponse.js';
import privacySettingsRules from '../privacySettings/privacySettings.rules.js';
import privacySettings from '../privacySettings/privacySettings.constants.js';

// unauthorized user is treated as public
// authenticated user could be himself
// authenticated user but not himself is treated as friends
// authenticated user could be admin
const getProfile = async (requester, username) => {
    try {
        // Retrieve the user's details including privacy settings and ID
        const userWithSettings = await UsersModel.findOne(
            { username },
            'privacySettings _id'
        ).lean();
        if (!userWithSettings) {
            return errorResponse('User not found.', httpStatus.NOT_FOUND);
        }

        const visibilitySetting = userWithSettings.privacySettings
            ? userWithSettings.privacySettings.profileVisibility
            : privacySettings.PROFILE_VISIBILITY.PUBLIC;
        const isSelf = requester && requester === userWithSettings._id; // Ensure correct comparison for MongoDB ObjectId
        const isAdmin = requester && requester.isAdmin; // Assume an isAdmin flag or a method to determine if the requester is an admin
        const isAuthenticated = !!requester; // Check if there's a requester ID indicating an authenticated user

        let accessibleFields = [];

        if (
            visibilitySetting === privacySettings.PROFILE_VISIBILITY.PRIVATE &&
            !isSelf &&
            !isAdmin
        ) {
            return errorResponse(
                'This profile is private.',
                httpStatus.FORBIDDEN
            );
        }

        if (isSelf) {
            accessibleFields = privacySettingsRules.ITSELF;
        } else if (isAdmin) {
            accessibleFields = Object.keys(UsersModel.schema.paths); // Admins can access all fields
        } else if (isAuthenticated) {
            // Apply FRIENDS settings if the user is authenticated but not viewing their own profile
            accessibleFields = privacySettingsRules.FRIENDS;
        } else {
            // Apply PUBLIC settings if the user is not authenticated
            accessibleFields = privacySettingsRules.PUBLIC;
        }

        let projection = { _id: 0 }; // Exclude `_id` by default
        accessibleFields.forEach((field) => {
            if (field === '*') {
                projection = {}; // Admin case: include all fields
            } else {
                projection[field] = 1; // Include specified fields for the given privacy settings
            }
        });

        // Fetch user details as per determined privacy settings
        const user = await UsersModel.findOne({ username }, projection).lean();
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
