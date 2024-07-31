import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';
import adminService from './admin.service.js';
import getRequestedDeviceDetails from '../../../utilities/getRequestedDeviceDetails.js';

const createNewAdmin = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const newUserData = await adminService.createNewAdmin(
        requester,
        req.body,
        hostData
    );

    newUserData.route = req.originalUrl;

    res.status(newUserData.status).send(newUserData);
});

const verifyAdmin = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const verifyData = await adminService.verifyAdmin(
        req.params.token,
        hostData
    );

    verifyData.route = req.originalUrl;

    res.status(verifyData.status).send(verifyData);
});

const resendAdminVerification = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const verificationData = await adminService.resendAdminVerification(
        req.params.id,
        hostData
    );

    verificationData.route = req.originalUrl;

    res.status(verificationData.status).send(verificationData);
});

const requestNewAdminPassword = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const requestNewPasswordData = await adminService.requestNewAdminPassword(
        req.body.email,
        hostData
    );

    requestNewPasswordData.route = req.originalUrl;

    res.status(requestNewPasswordData.status).send(requestNewPasswordData);
});

const resetAdminPassword = asyncErrorHandlerService(async (req, res) => {
    const hostData = {
        hostname: req.hostname,
        port: req.port,
    };
    const adminData = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        confirmNewPassword: req.body.confirmNewPassword,
    };
    const verificationData = await adminService.resetAdminPassword(
        hostData,
        req.params.token,
        adminData
    );

    verificationData.route = req.originalUrl;

    res.status(verificationData.status).send(verificationData);
});

const adminLogin = asyncErrorHandlerService(async (req, res) => {
    const { headers } = req;
    const userAgentString = headers['user-agent'];
    const device = await getRequestedDeviceDetails(req);
    const loginData = await adminService.adminLogin(
        req.body,
        userAgentString,
        device
    );

    loginData.route = req.originalUrl;

    res.status(loginData.status).send(loginData);
});

const adminLogout = asyncErrorHandlerService(async (req, res) => {
    const logoutData = await adminService.adminLogout(req);

    logoutData.route = req.originalUrl;

    res.status(logoutData.status).send(logoutData);
});

const adminController = {
    createNewAdmin,
    verifyAdmin,
    resendAdminVerification,
    requestNewAdminPassword,
    resetAdminPassword,
    adminLogin,
    adminLogout,
};

export default adminController;
