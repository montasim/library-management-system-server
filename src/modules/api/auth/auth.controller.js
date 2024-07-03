import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import authService from './auth.service.js';
import getRequestedDeviceDetails from '../../../utilities/getRequestedDeviceDetails.js';

const signup = asyncErrorHandler(async (req, res) => {
    const newUserData = await authService.signup(req.body);

    newUserData.route = req.originalUrl;

    res.status(newUserData.status).send(newUserData);
});

const login = asyncErrorHandler(async (req, res) => {
    const device = await getRequestedDeviceDetails(req);
    const userData = await authService.login(req.body, device);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const authController = {
    signup,
    login,
};

export default authController;
