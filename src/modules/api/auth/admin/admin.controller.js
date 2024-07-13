import asyncErrorHandler from '../../../../utilities/asyncErrorHandler.js';
import getRequesterId from '../../../../utilities/getRequesterId.js';
import adminService from './admin.service.js';
import getRequestedDeviceDetails
    from '../../../../utilities/getRequestedDeviceDetails.js';

const createAdmin = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const newUserData = await adminService.createAdmin(requester, req.body, hostData);

    newUserData.route = req.originalUrl;

    res.status(newUserData.status).send(newUserData);
});

const verify = asyncErrorHandler(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const verifyData = await adminService.verify(req.params.token, hostData);

    verifyData.route = req.originalUrl;

    res.status(verifyData.status).send(verifyData);
});

const resendVerification = asyncErrorHandler(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const verificationData = await adminService.resendVerification(
        req.params.id,
        hostData
    );

    verificationData.route = req.originalUrl;

    res.status(verificationData.status).send(verificationData);
});

const requestNewPassword = asyncErrorHandler(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const requestNewPasswordData = await adminService.requestNewPassword(
        req.body.email,
        hostData
    );

    requestNewPasswordData.route = req.originalUrl;

    res.status(requestNewPasswordData.status).send(requestNewPasswordData);
});

const resetPassword = asyncErrorHandler(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const adminData = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        confirmNewPassword: req.body.confirmNewPassword,
    };
    const verificationData = await adminService.resetPassword(
        hostData,
        req.params.token,
        adminData
    );

    verificationData.route = req.originalUrl;

    res.status(verificationData.status).send(verificationData);
});

const login = asyncErrorHandler(async (req, res) => {
    const { headers } = req;
    const userAgentString = headers['user-agent'];
    const device = await getRequestedDeviceDetails(req);
    const loginData = await adminService.login(
        req.body,
        userAgentString,
        device
    );

    loginData.route = req.originalUrl;

    res.status(loginData.status).send(loginData);
});

const logout = asyncErrorHandler(async (req, res) => {
    const logoutData = await adminService.logout(req);

    logoutData.route = req.originalUrl;

    res.status(logoutData.status).send(logoutData);
});

const adminController = {
    createAdmin,
    verify,
    resendVerification,
    requestNewPassword,
    resetPassword,
    login,
    logout,
};

export default adminController;
