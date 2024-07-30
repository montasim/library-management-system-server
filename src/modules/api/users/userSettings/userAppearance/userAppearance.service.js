import UsersModel from '../../users.model.js';
import errorResponse from '../../../../../utilities/errorResponse.js';
import httpStatus from '../../../../../constant/httpStatus.constants.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import loggerService from '../../../../../service/logger.service.js';

const getAppearance = async (requester) => {
    try {
        const user = await UsersModel.findById(requester).lean();
        if (!user) {
            return errorResponse(
                'Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Fetch only the appearance data of the user
        const userAppearance = await UsersModel.findById(
            requester,
            'appearance'
        ).lean();
        if (!userAppearance) {
            return errorResponse('User not found.', httpStatus.NOT_FOUND);
        }

        // Successfully retrieved appearance data
        return sendResponse(
            userAppearance.appearance,
            'Appearance data retrieved successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to retrieve appearance data: ${error}`);

        return errorResponse(
            'Failed to retrieve appearance data.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updateAppearance = async (requester, updateData) => {
    try {
        const existingUser = await UsersModel.findById(requester);
        if (!existingUser) {
            return errorResponse(
                'Unauthorized. Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Check if the 'theme' object and 'name' field exists in updateData
        if (!updateData.theme || typeof updateData.theme.name !== 'string') {
            return errorResponse(
                'Invalid or missing theme data.',
                httpStatus.BAD_REQUEST
            );
        }

        // Capture the old theme details
        const oldThemeName =
            existingUser.appearance &&
            existingUser.appearance.theme &&
            existingUser.appearance.theme.name
                ? existingUser.appearance.theme.name
                : 'None';

        const themeUpdate = {
            'appearance.theme.name': updateData.theme.name,
            updatedBy: requester,
        };

        // Prepare the activity record with old and new theme details
        const activityRecord = {
            category: userConstants.activityType.APPEARANCE,
            action: 'update theme',
            details: `Theme updated from '${oldThemeName}' to '${updateData.theme.name}'`,
            metadata: {
                oldTheme: oldThemeName,
                updatedTheme: updateData.theme.name,
            },
            date: new Date(), // Ensure date is set at the time of the operation
        };

        // Update user document with theme change and log activity
        const updatedUser = await UsersModel.findByIdAndUpdate(
            requester,
            {
                $set: themeUpdate,
                $push: { activities: activityRecord }, // Push the new activity to the activities array
            },
            { new: true, runValidators: true }
        ).lean();

        // Remove sensitive data before sending to client
        delete updatedUser.passwordHash;
        delete updatedUser.resetPasswordVerifyToken;
        delete updatedUser.resetPasswordVerifyTokenExpires;
        delete updatedUser.emailVerifyToken;
        delete updatedUser.emailVerifyTokenExpires;

        return sendResponse(
            updatedUser,
            'User theme updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update user: ${error}`);

        return errorResponse(
            'Failed to update user.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const userAppearanceService = {
    getAppearance,
    updateAppearance,
};

export default userAppearanceService;
