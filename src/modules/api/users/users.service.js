import UsersModel from './users.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import GoogleDriveFileOperations from '../../../utilities/googleDriveFileOperations.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants
    from '../../../constant/fileExtensions.constants.js';
import userConstants from './users.constants.js';

const getUser = async (userId) => {
    const user = await UsersModel.findById(userId).lean();
    if (!user) {
        return errorResponse(
            'Please login first.',
            httpStatus.UNAUTHORIZED
        );
    }

    // Remove sensitive data
    delete user.password;
    delete user.emailVerifyToken;
    delete user.emailVerifyTokenExpires;
    delete user.phoneVerifyToken;
    delete user.phoneVerifyTokenExpires;
    delete user.resetPasswordVerifyToken;
    delete user.resetPasswordVerifyTokenExpires;

    return sendResponse(
        user,
        'User fetched successfully.',
        httpStatus.OK
    );
};

const updateUser = async (requester, updateData, userImage) => {
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

    const fileValidationResults = validateFile(userImage, userConstants.imageSize, [mimeTypesConstants.JPG, mimeTypesConstants.PNG], [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]);
    if (!fileValidationResults.isValid) {
        return errorResponse(
            fileValidationResults.message,
            httpStatus.BAD_REQUEST
        );
    }

    updateData.updatedBy = requester;

    let userImageData = {};

    // Handle file update
    if (userImage) {
        // Delete the old file from Google Drive if it exists
        const oldFileId = existingUser.image?.fileId;
        if (oldFileId) {
            await GoogleDriveFileOperations.deleteFile(oldFileId);
        }

        userImageData = await GoogleDriveFileOperations.uploadFile(userImage);

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

    const updatedUser = await UsersModel.findByIdAndUpdate(requester, updateData, {
        new: true,
    }).lean();

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
};

const deleteUser = async (userId) => {
    const existingUser = await UsersModel.findById(userId).lean();
    if (!existingUser) {
        return errorResponse(
            'Please login first.',
            httpStatus.UNAUTHORIZED
        );
    }

    // Delete the old file from Google Drive if it exists
    const oldFileId = existingUser.image?.fileId;
    if (oldFileId) {
        await GoogleDriveFileOperations.deleteFile(oldFileId);
    }

    await UsersModel.findByIdAndDelete(userId);

    return sendResponse(
        {},
        'User deleted successfully.',
        httpStatus.BAD_REQUEST
    );
};

const usersService = {
    getUser,
    updateUser,
    deleteUser,
};

export default usersService;
