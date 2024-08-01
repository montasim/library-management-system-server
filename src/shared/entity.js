import asyncErrorHandlerService from '../utilities/asyncErrorHandler.js';
import getRequesterId from '../utilities/getRequesterId.js';
import loggerService from '../service/logger.service.js';
import getHostData from '../utilities/getHostData.js';
import getRequestedDeviceDetails from '../utilities/getRequestedDeviceDetails.js';

// TODO: Implement the `entity` log

const createNewUserEntity = (service, createFunction) =>
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

const signupEntity = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const newUserData = await service[createFunction](req.body, hostData);

        newUserData.route = req.originalUrl;
        res.status(newUserData.status).send(newUserData);
    });

const verifyEntity = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const verifyData = await service[createFunction](
            req.params.token,
            hostData
        );

        verifyData.route = req.originalUrl;
        res.status(verifyData.status).send(verifyData);
    });

const resendVerificationEntity = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const verificationData = await service[createFunction](
            req.params.id,
            hostData
        );

        verificationData.route = req.originalUrl;
        res.status(verificationData.status).send(verificationData);
    });

const requestNewPasswordEntity = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const requestNewPasswordData = await service[createFunction](
            req.body.email,
            hostData
        );

        requestNewPasswordData.route = req.originalUrl;
        res.status(requestNewPasswordData.status).send(requestNewPasswordData);
    });

const resetPasswordEntity = (service, createFunction) =>
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

const loginEntity = (service, createFunction) =>
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

const logoutEntity = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const hostData = getHostData(req);
        const device = await getRequestedDeviceDetails(req);
        const logoutData = await service[createFunction](req, device, hostData);

        logoutData.route = req.originalUrl;
        res.status(logoutData.status).send(logoutData);
    });

const createEntity = (service, createFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req);
        const includesFile = req.file;

        // Determine the query to pass based on the presence of `requester`.
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

const getEntityList = (service, getListFunction) =>
    asyncErrorHandlerService(async (req, res) => {
        const requester = getRequesterId(req) || null;

        // Determine the query to pass based on the presence of `requester`.
        const query = requester ? [requester, req.query] : [req.query];

        // Call the service function with the appropriate query.
        const dataList = await service[getListFunction](...query);

        loggerService.info(
            `Entity list retrieved for requester ${requester || 'anonymous'} at ${req.originalUrl}`
        );

        dataList.route = req.originalUrl;
        res.status(dataList.status).send(dataList);
    });

const getEntityById = (service, getByIdFunction, paramsId) =>
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

const updateEntityById = (service, updateByIdFunction, paramsId) =>
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

const deleteEntityById = (service, deleteByIdFunction, paramsId) =>
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

const deleteEntityList = (service, deleteByIdFunction) =>
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

const entity = {
    createNewUserEntity,
    signupEntity,
    verifyEntity,
    resendVerificationEntity,
    requestNewPasswordEntity,
    resetPasswordEntity,
    loginEntity,
    logoutEntity,

    createEntity,
    getEntityList,
    getEntityById,
    updateEntityById,
    deleteEntityById,
    deleteEntityList,
};

export default entity;
