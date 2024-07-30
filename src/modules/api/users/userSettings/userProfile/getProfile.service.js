import UsersModel from '../../users.model.js';
import errorResponse from '../../../../../utilities/errorResponse.js';
import httpStatus from '../../../../../constant/httpStatus.constants.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import loggerService from '../../../../../service/logger.service.js';
import isEmptyObject from '../../../../../utilities/isEmptyObject.js';
import validateFile from '../../../../../utilities/validateFile.js';
import userConstants from '../../users.constants.js';
import mimeTypesConstants from '../../../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../../../constant/fileExtensions.constants.js';
import GoogleDriveService from '../../../../../service/googleDrive.service.js';

const getProfile = async (userId) => {
    try {
        const user = await UsersModel.findById(userId).lean();
        if (!user) {
            return errorResponse(
                'Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Remove sensitive data, considering the user may have multiple emails
        user.emails.forEach((email) => {
            delete email.emailVerifyToken;
            delete email.emailVerifyTokenExpires;
        });
        user.mobiles.forEach((mobile) => {
            delete mobile.phoneVerifyToken;
            delete mobile.phoneVerifyTokenExpires;
        });
        delete user.passwordHash;
        delete user.resetPasswordVerifyToken;
        delete user.resetPasswordVerifyTokenExpires;

        return sendResponse(user, 'User fetched successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to get user details: ${error}`);

        return errorResponse(
            error.message || 'Failed to get user details.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updateProfile = async (requester, updateData, userImage) => {
    try {
        // Fetch the existing user; no need to lean() if updates are to be applied.
        const existingUser = await UsersModel.findById(requester);
        if (!existingUser) {
            return errorResponse(
                'Unauthorized. Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Validate provided update data
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        // // Optionally, check if the updates are allowed based on the schema
        // const updatesAllowed = ['name', 'bio', 'username']; // Example fields that can be updated
        // const updates = Object.keys(updateData).filter(key => updatesAllowed.includes(key));
        // if (updates.length === 0) {
        //     return errorResponse('Invalid update fields.', httpStatus.BAD_REQUEST);
        // }

        // Handle image upload and update if provided
        if (userImage) {
            const fileValidationResults = validateFile(
                userImage,
                userConstants.imageSize,
                [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
                [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
            );

            if (!fileValidationResults.isValid) {
                return errorResponse(
                    fileValidationResults.message,
                    httpStatus.BAD_REQUEST
                );
            }

            // Remove the old image file if it exists
            const oldFileId = existingUser.image?.fileId;
            if (oldFileId) {
                await GoogleDriveService.deleteFile(oldFileId);
            }

            // Upload new image file
            const newImageData = await GoogleDriveService.uploadFile(userImage);
            if (!newImageData || newImageData instanceof Error) {
                return errorResponse(
                    'Failed to update image.',
                    httpStatus.INTERNAL_SERVER_ERROR
                );
            }

            // Update image data in update object
            updateData.image = {
                fileId: newImageData.fileId,
                shareableLink: newImageData.shareableLink,
                downloadLink: newImageData.downloadLink,
            };
        }

        // Apply updates to the user document
        updateData.updatedBy = requester; // Track who made the update
        const updatedUser = await UsersModel.findByIdAndUpdate(
            requester,
            { $set: updateData },
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
            'User updated successfully.',
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

const userProfileService = {
    getProfile,
    updateProfile,
};

export default userProfileService;
