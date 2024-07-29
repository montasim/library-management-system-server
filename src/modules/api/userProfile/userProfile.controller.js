import asyncErrorHandlerService
    from '../../../service/asyncErrorHandler.service.js';
import userProfileService from './userProfile.service.js';

const getProfile = asyncErrorHandlerService(async (req, res) => {
    const permissionData = await userProfileService.getProfile(
        req.params.username
    );

    permissionData.route = req.originalUrl;

    res.status(permissionData.status).send(permissionData);
});

const userProfileController = {
    getProfile
};

export default userProfileController;
