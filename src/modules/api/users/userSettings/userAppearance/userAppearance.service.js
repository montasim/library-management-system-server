import UsersModel from '../../users.model.js';
import errorResponse from '../../../../../utilities/errorResponse.js';
import httpStatus from '../../../../../constant/httpStatus.constants.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import loggerService from '../../../../../service/logger.service.js';
import isEmptyObject from '../../../../../utilities/isEmptyObject.js';
import validateFile from '../../../../../utilities/validateFile.js';
import userConstants from '../../users.constants.js';
import mimeTypesConstants from '../../../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants
    from '../../../../../constant/fileExtensions.constants.js';
import GoogleDriveService from '../../../../../service/googleDrive.service.js';

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
        const userAppearance = await UsersModel.findById(requester, 'appearance').lean();
        if (!userAppearance) {
            return errorResponse(
                'User not found.',
                httpStatus.NOT_FOUND
            );
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

        // Prepare the update object specifically for theme
        const themeUpdate = {
            'appearance.theme.name': updateData.theme.name,
            updatedBy: requester  // Track who made the update
        };

        // Perform the update
        const updatedUser = await UsersModel.findByIdAndUpdate(
            requester,
            { $set: themeUpdate },
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
