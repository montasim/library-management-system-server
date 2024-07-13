import getAuthenticationToken from '../utilities/getAuthenticationToken.js';
import httpStatus from '../constant/httpStatus.constants.js';
import decodeAuthenticationToken from '../utilities/decodeAuthenticationToken.js';
import validateUserRequest from '../utilities/validateUserRequest.js';
import validateAdminRequest from '../utilities/validateAdminRequest.js';

const user = async (req, res, next) => {
    const token = await getAuthenticationToken(req?.headers['authorization']);

    if (!token) {
        const forbiddenData = {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Access forbidden. No token provided.',
            status: httpStatus.FORBIDDEN,
            route: req.originalUrl,
        };

        return res.status(forbiddenData.status).send(forbiddenData);
    }

    try {
        const decodedData = await decodeAuthenticationToken(token);
        const requester = decodedData ? decodedData.currentUser._id : undefined;
        const isAuthorized = await validateUserRequest(requester);

        if (!isAuthorized) {
            const unauthorizedData = {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Unauthorized access.',
                status: httpStatus.UNAUTHORIZED,
                route: req.originalUrl,
            };

            return res.status(unauthorizedData.status).send(unauthorizedData);
        }

        req.sessionUser = decodedData;

        next();
    } catch (error) {
        const forbiddenData = {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Your session has expired. Please login again.',
            status: httpStatus.FORBIDDEN,
            route: req.originalUrl,
        };

        return res.status(forbiddenData.status).send(forbiddenData);
    }
};

const admin = async (req, res, next) => {
    const token = await getAuthenticationToken(req?.headers['authorization']);

    if (!token) {
        const forbiddenData = {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Access forbidden. No token provided.',
            status: httpStatus.FORBIDDEN,
            route: req.originalUrl,
        };

        return res.status(forbiddenData.status).send(forbiddenData);
    }

    try {
        const decodedData = await decodeAuthenticationToken(token);
        const requester = decodedData ? decodedData.currentUser._id : undefined;
        const isAuthorized = await validateAdminRequest(requester);

        if (!isAuthorized) {
            const unauthorizedData = {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Unauthorized access.',
                status: httpStatus.UNAUTHORIZED,
                route: req.originalUrl,
            };

            return res.status(unauthorizedData.status).send(unauthorizedData);
        }

        req.sessionUser = decodedData;

        next();
    } catch (error) {
        const forbiddenData = {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Your session has expired. Please login again.',
            status: httpStatus.FORBIDDEN,
            route: req.originalUrl,
        };

        return res.status(forbiddenData.status).send(forbiddenData);
    }
};

const authenticateMiddleware = {
    user,
    admin,
};

export default authenticateMiddleware;
