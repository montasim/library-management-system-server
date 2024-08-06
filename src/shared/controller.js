import asyncErrorHandlerService from '../utilities/asyncErrorHandler.js';
import getRequesterId from '../utilities/getRequesterId.js';
import loggerService from '../service/logger.service.js';
import getHostData from '../utilities/getHostData.js';
import getRequestedDeviceDetails from '../utilities/getRequestedDeviceDetails.js';

// TODO: Implement the `controller` log
// TODO: utilize the hostData for every controller

const createNewUser = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const hostData = getHostData(req);
        const newUserData = await service[createFunction](
            requester,
            req.body,
            hostData
        );

        newUserData.route = req.originalUrl;
        res.status(newUserData.status).send(newUserData);
    });

const signup = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const newUserData = await service[createFunction](req.body, hostData);

        newUserData.route = req.originalUrl;
        res.status(newUserData.status).send(newUserData);
    });

const verify = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const verifyData = await service[createFunction](
            req.params.token,
            hostData
        );

        verifyData.route = req.originalUrl;
        res.status(verifyData.status).send(verifyData);
    });

const resendVerification = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const verificationData = await service[createFunction](
            req.params.id,
            hostData
        );

        verificationData.route = req.originalUrl;
        res.status(verificationData.status).send(verificationData);
    });

const requestNewPassword = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const requestNewPasswordData = await service[createFunction](
            req.body.email,
            hostData
        );

        requestNewPasswordData.route = req.originalUrl;
        res.status(requestNewPasswordData.status).send(requestNewPasswordData);
    });

const resetPassword = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const userData = {
            oldPassword: req.body.oldPassword,
            newPassword: req.body.newPassword,
            confirmNewPassword: req.body.confirmNewPassword,
        };
        const requestNewPasswordData = await service[createFunction](
            hostData,
            req.params.token,
            userData
        );

        requestNewPasswordData.route = req.originalUrl;
        res.status(requestNewPasswordData.status).send(requestNewPasswordData);
    });

const login = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const device = await getRequestedDeviceDetails(req);
        const loginData = await service[createFunction](
            req.body,
            req.headers['user-agent'],
            device,
            hostData
        );

        loginData.route = req.originalUrl;
        res.status(loginData.status).send(loginData);
    });

const logout = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const device = await getRequestedDeviceDetails(req);
        const logoutData = await service[createFunction](req, device, hostData);

        logoutData.route = req.originalUrl;
        res.status(logoutData.status).send(logoutData);
    });

const createWithId = (service, createFunction, resourceId) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const paramsId = req.params[resourceId];

        // Determine the params to pass based on the presence of `paramsId`.
        const body = paramsId ? [requester, paramsId] : [requester];

        // Call the service function with the appropriate query.
        const newData = await service[createFunction](...body);

        loggerService.info(
            `Entity created by ${requester} at ${req.originalUrl}`,
            newData
        );

        newData.route = req.originalUrl;
        res.status(newData.status).send(newData);
    });

const create = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const includesFile = req.file;

        // Determine the body to pass based on the presence of `includesFile`.
        const body = includesFile
            ? [requester, req.body, includesFile]
            : [requester, req.body];

        // Call the service function with the appropriate query.
        const newData = await service[createFunction](...body);

        loggerService.info(
            `Entity created by ${requester} at ${req.originalUrl}`,
            newData
        );

        newData.route = req.originalUrl;
        res.status(newData.status).send(newData);
    });

const getList = (service, getListFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req) || null;

        // Determine the query to pass based on the presence of `requester`.
        const query = requester ? [requester, req.query] : [req.query];

        // Call the service function with the appropriate query.
        const dataList = getListFunction
            ? await service[getListFunction](...query)
            : await service(...query);

        loggerService.info(
            `Entity list retrieved for requester ${requester || 'anonymous'} at ${req.originalUrl}`
        );

        dataList.route = req.originalUrl;
        res.status(dataList.status).send(dataList);
    });

const getById = (service, getByIdFunction, paramsId) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);

        // Determine the parameters to pass based on the presence of `requester`.
        const params = requester
            ? [requester, req.params[paramsId]]
            : [req.params[paramsId]];

        // Call the service function with the appropriate parameters.
        const data = await service[getByIdFunction](...params);

        loggerService.info(
            `Details retrieved for entity ID ${req.params[paramsId]} by ${requester} at ${req.originalUrl}`
        );

        data.route = req.originalUrl;
        res.status(data.status).send(data);
    });

const getByRequester = (service, getByIdFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);

        // Call the service function with the appropriate parameters.
        const requesterData = await service[getByIdFunction](requester);

        loggerService.info(
            `Details retrieved for entity ID ${req.params[requester]} by ${requester} at ${req.originalUrl}`
        );

        requesterData.route = req.originalUrl;
        res.status(requesterData.status).send(requesterData);
    });

const updateById = (service, updateByIdFunction, paramsId) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const includesFile = req.file;

        // Determine the query to pass based on the presence of `requester`.
        const body = includesFile
            ? [requester, paramsId, req.body, includesFile]
            : [requester, paramsId, req.body];

        // Call the service function with the appropriate query.
        const updatedData = await service[updateByIdFunction](...body);

        loggerService.info(
            `Entity ${req.params[paramsId]} updated by ${requester} at ${req.originalUrl}`
        );

        updatedData.route = req.originalUrl;
        res.status(updatedData.status).send(updatedData);
    });

const updateByRequester = (service, updateByIdFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const includesFile = req.file;

        // Determine the query to pass based on the presence of `requester`.
        const body = [requester, req.body, includesFile];

        // Call the service function with the appropriate query.
        const updatedData = await service[updateByIdFunction](...body);

        loggerService.info(
            `Entity ${req.params[requester]} updated by ${requester} at ${req.originalUrl}`
        );

        updatedData.route = req.originalUrl;
        res.status(updatedData.status).send(updatedData);
    });

const deleteById = (service, deleteByIdFunction, paramsId) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const deletedData = await service[deleteByIdFunction](
            requester,
            req.params[paramsId]
        );

        loggerService.warn(
            `Entity ${req.params[paramsId]} deleted by ${requester} at ${req.originalUrl}`
        );

        deletedData.route = req.originalUrl;
        res.status(deletedData.status).send(deletedData);
    });

const deleteList = (service, deleteByIdFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const ids = req.query.ids.split(',');
        const deletedListData = await service[deleteByIdFunction](
            requester,
            ids
        );

        loggerService.warn(
            `Multiple entities [${ids.join(', ')}] deleted by ${requester} at ${req.originalUrl}`
        );

        deletedListData.route = req.originalUrl;
        res.status(deletedListData.status).send(deletedListData);
    });

const controller = {
    createNewUser,
    signup,
    verify,
    resendVerification,
    requestNewPassword,
    resetPassword,
    login,
    logout,

    createWithId,
    create,
    getList,
    getById,
    getByRequester,
    updateById,
    updateByRequester,
    deleteById,
    deleteList,
};

export default controller;
