import asyncErrorHandlerService
    from '../../../../../utilities/asyncErrorHandler.js';
import getRequesterId from '../../../../../utilities/getRequesterId.js';
import userAppearanceService from './userAppearance.service.js';

const getAppearance = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userData = await userAppearanceService.getAppearance(requester);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const updateAppearance = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedUserData = await userAppearanceService.updateAppearance(
        requester,
        req.body,
    );

    updatedUserData.route = req.originalUrl;

    res.status(updatedUserData.status).send(updatedUserData);
});

const userAppearanceController = {
    getAppearance,
    updateAppearance,
};

export default userAppearanceController;
