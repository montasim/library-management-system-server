import UsersModel from './users.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import GoogleDriveFileOperations from '../../../utilities/googleDriveFileOperations.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';

const getUser = async (userId) => {
    const user = await UsersModel.findById(userId).lean();

    if (!user) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Please login first.',
            status: httpStatus.FORBIDDEN,
        };
    }

    // Remove sensitive data
    delete user.password;
    delete user.emailVerifyToken;
    delete user.emailVerifyTokenExpires;
    delete user.phoneVerifyToken;
    delete user.phoneVerifyTokenExpires;
    delete user.resetPasswordVerifyToken;
    delete user.resetPasswordVerifyTokenExpires;

    return {
        timeStamp: new Date(),
        success: true,
        data: user,
        message: 'User fetched successfully.',
        status: httpStatus.OK,
    };
};

const updateUser = async (userId, updateData, userImage) => {
    const existingUser = await UsersModel.findById(userId).lean();

    if (!existingUser) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Please login first.',
            status: httpStatus.FORBIDDEN,
        };
    }

    if (isEmptyObject(updateData)) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Please provide update data.',
            status: httpStatus.BAD_REQUEST,
        };
    }

    updateData.updatedBy = userId;

    let userImageData = {};

    // Handle file update
    if (userImage) {
        // Delete the old file from Google Drive if it exists
        const oldFileId = existingUser.image?.fileId;
        if (oldFileId) {
            await GoogleDriveFileOperations.deleteFile(oldFileId);
        }

        userImageData =
            await GoogleDriveFileOperations.uploadFile(userImage);

        if (!userImageData || userImageData instanceof Error) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Failed to save image.',
                status: httpStatus.INTERNAL_SERVER_ERROR,
            };
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
        userId,
        updateData,
        {
            new: true,
        }
    );

    if (!updatedUser) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'User not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    // Remove sensitive data
    delete updatedUser.password;
    delete updatedUser.emailVerifyToken;
    delete updatedUser.emailVerifyTokenExpires;
    delete updatedUser.phoneVerifyToken;
    delete updatedUser.phoneVerifyTokenExpires;
    delete updatedUser.resetPasswordVerifyToken;
    delete updatedUser.resetPasswordVerifyTokenExpires;

    return {
        timeStamp: new Date(),
        success: true,
        data: updatedUser,
        message: 'User updated successfully.',
        status: httpStatus.OK,
    };
};

const deleteUser = async (userId) => {
    const existingUser = await UsersModel.findById(userId).lean();

    if (!existingUser) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Please login first.',
            status: httpStatus.FORBIDDEN,
        };
    }

    // Delete the old file from Google Drive if it exists
    const oldFileId = existingUser.image?.fileId;
    if (oldFileId) {
        await GoogleDriveFileOperations.deleteFile(oldFileId);
    }

    const user = await UsersModel.findByIdAndDelete(userId);

    if (!user) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'User not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'User deleted successfully.',
        status: httpStatus.OK,
    };
};

const usersService = {
    getUser,
    updateUser,
    deleteUser,
};

export default usersService;
