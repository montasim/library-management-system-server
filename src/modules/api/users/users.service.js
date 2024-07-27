import UsersModel from './users.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import GoogleDriveFileOperations from '../../../utilities/googleDriveFileOperations.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../constant/fileExtensions.constants.js';
import userConstants from './users.constants.js';
import logger from '../../../utilities/logger.js';

const getUser = async (userId) => {
    try {
        const user = await UsersModel.findById(userId).lean();
        if (!user) {
            return errorResponse(
                'Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        // Remove sensitive data, considering the user may have multiple emails
        user.emails.forEach(email => {
            delete email.emailVerifyToken;
            delete email.emailVerifyTokenExpires;
        });
        user.mobiles.forEach(mobile => {
            delete mobile.phoneVerifyToken;
            delete mobile.phoneVerifyTokenExpires;
        });
        delete user.passwordHash;
        delete user.resetPasswordVerifyToken;
        delete user.resetPasswordVerifyTokenExpires;

        return sendResponse(user, 'User fetched successfully.', httpStatus.OK);
    } catch (error) {
        logger.error(`Failed to get user details: ${error}`);

        return errorResponse(
            error.message || 'Failed to get user details.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updateUser = async (requester, updateData, userImage) => {
    try {
        const existingUser = await UsersModel.findById(requester).lean();
        if (!existingUser) {
            return errorResponse(
                'Please login first.',
                httpStatus.UNAUTHORIZED
            );
        }

        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        let userImageData = {};

        // Handle file update
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

            // Delete the old file from Google Drive if it exists
            const oldFileId = existingUser.image?.fileId;
            if (oldFileId) {
                await GoogleDriveFileOperations.deleteFile(oldFileId);
            }

            userImageData =
                await GoogleDriveFileOperations.uploadFile(userImage);

            if (!userImageData || userImageData instanceof Error) {
                return errorResponse(
                    'Failed to save image.',
                    httpStatus.INTERNAL_SERVER_ERROR
                );
            }

            userImageData = {
                fileId: userImageData.fileId,
                shareableLink: userImageData.shareableLink,
                downloadLink: userImageData.downloadLink,
            };

            if (userImageData) {
                updateData.image = userImageData;
            }
        }

        const updatedUser = await UsersModel.findByIdAndUpdate(
            requester,
            updateData,
            {
                new: true,
            }
        ).lean();

        // Remove sensitive data
        delete updatedUser.password;
        delete updatedUser.emailVerifyToken;
        delete updatedUser.emailVerifyTokenExpires;
        delete updatedUser.phoneVerifyToken;
        delete updatedUser.phoneVerifyTokenExpires;
        delete updatedUser.resetPasswordVerifyToken;
        delete updatedUser.resetPasswordVerifyTokenExpires;

        return sendResponse(
            updatedUser,
            'User updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to update user data: ${error}`);

        return errorResponse(
            error.message || 'Failed to update user data.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteUser = async (userId, confirmationData) => {
    try {
        const existingUser = await UsersModel.findById(userId).lean();
        if (!existingUser) {
            return errorResponse(
                'User not found.',
                httpStatus.NOT_FOUND
            );
        }

        // TODO: create a system to verify confirmation from user before delete user account. can use github like system, confirm delete text.

        // Delete the old file from Google Drive if it exists
        const oldFileId = existingUser.image?.fileId;
        if (oldFileId) {
            await GoogleDriveFileOperations.deleteFile(oldFileId);
        }

        await UsersModel.findByIdAndDelete(userId);

        return sendResponse(
            {},
            'User deleted successfully.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to delete account: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete account.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const usersService = {
    getUser,
    updateUser,
    deleteUser,
};

export default usersService;
