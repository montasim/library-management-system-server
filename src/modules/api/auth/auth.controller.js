import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import authService from './auth.service.js';
import getRequestedDeviceDetails from '../../../utilities/getRequestedDeviceDetails.js';

const signup = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const newUserData = await authService.signup(req.body, hostData);

    newUserData.route = req.originalUrl;

    res.status(newUserData.status).send(newUserData);
});

const verify = asyncErrorHandlerService(async (req, res) => {
    const verifyData = await authService.verify(req.params.token);

    verifyData.route = req.originalUrl;

    res.status(verifyData.status).send(verifyData);
});

const resendVerification = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const verificationData = await authService.resendVerification(
        req.params.id,
        hostData
    );

    verificationData.route = req.originalUrl;

    res.status(verificationData.status).send(verificationData);
});

const requestNewPassword = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const requestNewPasswordData = await authService.requestNewPassword(
        req.body.email,
        hostData
    );

    requestNewPasswordData.route = req.originalUrl;

    res.status(requestNewPasswordData.status).send(requestNewPasswordData);
});

const resetPassword = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const userData = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        confirmNewPassword: req.body.confirmNewPassword,
    };
    const verificationData = await authService.resetPassword(
        hostData,
        req.params.token,
        userData
    );

    verificationData.route = req.originalUrl;

    res.status(verificationData.status).send(verificationData);
});

const login = asyncErrorHandlerService(async (req, res) => {
    const { headers } = req;
    const userAgentString = headers['user-agent'];
    const device = await getRequestedDeviceDetails(req);
    const loginData = await authService.login(
        req.body,
        userAgentString,
        device
    );

    loginData.route = req.originalUrl;

    res.status(loginData.status).send(loginData);
});

const logout = asyncErrorHandlerService(async (req, res) => {
    const logoutData = await authService.logout(req);

    logoutData.route = req.originalUrl;

    res.status(logoutData.status).send(logoutData);
});

const authController = {
    signup,
    verify,
    resendVerification,
    requestNewPassword,
    resetPassword,
    login,
    logout,
};

export default authController;
