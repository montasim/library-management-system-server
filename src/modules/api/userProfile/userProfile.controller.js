import asyncErrorHandlerService
    from '../../../service/asyncErrorHandler.service.js';
import userProfileService from './userProfile.service.js';

const getProfile = asyncErrorHandlerService(async (req, res) => {
    const requester = req?.sessionUser?.currentUser?._id || null;
    const permissionData = await userProfileService.getProfile(
        req.params.username,
        requester,
    );

    permissionData.route = req.originalUrl;

    res.status(permissionData.status).send(permissionData);
});

const userProfileController = {
    getProfile
};

export default userProfileController;
