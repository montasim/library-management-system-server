import getAuthenticationToken from '../utilities/getAuthenticationToken.js';
import httpStatus from '../constant/httpStatus.constants.js';
import decodeAuthenticationToken from '../utilities/decodeAuthenticationToken.js';
import validateUserRequest from '../utilities/validateUserRequest.js';
import validateAdminRequest from '../utilities/validateAdminRequest.js';

// Helper to create error response data
const createErrorData = (message, status, route) => ({
    timeStamp: new Date(),
    success: false,
    data: {},
    message,
    status,
    route,
});

// Function to process authentication and authorization
const processAuthentication = async (
    req,
    res,
    next,
    validateFunc,
    optional = false
) => {
    const token = await getAuthenticationToken(req?.headers['authorization']);

    if (!token) {
        if (optional) {
            return next(); // Continue without setting user session
        }
        return res
            .status(httpStatus.FORBIDDEN)
            .send(
                createErrorData(
                    'Access forbidden. No token provided.',
                    httpStatus.FORBIDDEN,
                    req.originalUrl
                )
            );
    }

    try {
        const decodedData = await decodeAuthenticationToken(token);
        const requester = decodedData ? decodedData.currentUser._id : undefined;
        const isAuthorized = await validateFunc(requester);

        if (!isAuthorized) {
            if (optional) {
                return next(); // Continue without setting user session
            }

            return res
                .status(httpStatus.UNAUTHORIZED)
                .send(
                    createErrorData(
                        'Unauthorized access.',
                        httpStatus.UNAUTHORIZED,
                        req.originalUrl
                    )
                );
        }

        req.sessionUser = decodedData;

        next();
    } catch (error) {
        return res
            .status(httpStatus.FORBIDDEN)
            .send(
                createErrorData(
                    'Your session has expired. Please login again.',
                    httpStatus.FORBIDDEN,
                    req.originalUrl
                )
            );
    }
};

const user = (req, res, next) =>
    processAuthentication(req, res, next, validateUserRequest);
const admin = (req, res, next) =>
    processAuthentication(req, res, next, validateAdminRequest);
const optionalAuth = (req, res, next) =>
    processAuthentication(req, res, next, () => true, true);

const authenticateMiddleware = { user, admin, optionalAuth };

export default authenticateMiddleware;
