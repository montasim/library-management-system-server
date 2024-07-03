import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import authService from './auth.service.js';
import getRequestedDeviceDetails from '../../../utilities/getRequestedDeviceDetails.js';

const signup = asyncErrorHandler(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port
    }
    const newUserData = await authService.signup(req.body, hostData);

    newUserData.route = req.originalUrl;

    res.status(newUserData.status).send(newUserData);
});

const verify = asyncErrorHandler(async (req, res) => {
    const verifyData = await authService.verify(req.params.token);

    verifyData.route = req.originalUrl;

    res.status(verifyData.status).send(verifyData);
});

const resendVerification = asyncErrorHandler(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port
    }
    const verificationData = await authService.resendVerification(req.params.id, hostData);

    verificationData.route = req.originalUrl;

    res.status(verificationData.status).send(verificationData);
});

const login = asyncErrorHandler(async (req, res) => {
    const device = await getRequestedDeviceDetails(req);
    const userData = await authService.login(req.body, device);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const authController = {
    signup,
    verify,
    resendVerification,
    login,
};

export default authController;