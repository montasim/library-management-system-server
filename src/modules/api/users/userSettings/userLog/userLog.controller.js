import asyncErrorHandlerService from '../../../../../utilities/asyncErrorHandler.js';
import getRequesterId from '../../../../../utilities/getRequesterId.js';
import userLogService from './userLog.service.js';

const getActivityLog = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userData = await userLogService.getActivityLog(requester);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const getSecurityLog = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userData = await userLogService.getSecurityLog(requester);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const getAccountLog = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userData = await userLogService.getAccountLog(requester);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const userLogController = {
    getActivityLog,
    getSecurityLog,
    getAccountLog,
};

export default userLogController;
