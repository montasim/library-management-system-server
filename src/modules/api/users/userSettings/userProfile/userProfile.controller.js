import asyncErrorHandlerService
    from '../../../../../utilities/asyncErrorHandler.js';
import getRequesterId from '../../../../../utilities/getRequesterId.js';
import userProfileService from './getProfile.service.js';

const getProfile = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userData = await userProfileService.getProfile(requester);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const updateProfile = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userImage = req.file;
    const updatedUserData = await userProfileService.updateProfile(
        requester,
        req.body,
        userImage
    );

    updatedUserData.route = req.originalUrl;

    res.status(updatedUserData.status).send(updatedUserData);
});

const userProfileController = {
    getProfile,
    updateProfile,
};

export default userProfileController;
