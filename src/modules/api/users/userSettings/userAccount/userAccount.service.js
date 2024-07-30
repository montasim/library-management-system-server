import UsersModel from '../../users.model.js';
import httpStatus from '../../../../../constant/httpStatus.constants.js';
import GoogleDriveService from '../../../../../service/googleDrive.service.js';
import errorResponse from '../../../../../utilities/errorResponse.js';
import constants from '../../../../../constant/constants.js';
import sendResponse from '../../../../../utilities/sendResponse.js';
import loggerService from '../../../../../service/logger.service.js';

const deleteAccount = async (userId, confirmationData) => {
    try {
        const existingUser = await UsersModel.findById(userId).lean();
        if (!existingUser) {
            return errorResponse('User not found.', httpStatus.NOT_FOUND);
        }

        if (
            confirmationData.confirmationText !==
            constants.confirmationText.deleteUserAccount
        ) {
            return errorResponse(
                'Confirmation text did not matched.',
                httpStatus.BAD_REQUEST
            );
        }

        // TODO: create a system to verify confirmation from user before delete user account. can use github like system, confirm delete text.

        // Delete the old file from Google Drive if it exists
        const oldFileId = existingUser.image?.fileId;
        if (oldFileId) {
            await GoogleDriveService.deleteFile(oldFileId);
        }

        await UsersModel.findByIdAndDelete(userId);

        return sendResponse({}, 'User deleted successfully.', httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to delete account: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete account.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const userAccountService = {
    deleteAccount,
};

export default userAccountService;
