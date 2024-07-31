import getAuthenticationToken from '../utilities/getAuthenticationToken.js';
import httpStatus from '../constant/httpStatus.constants.js';
import decodeAuthenticationToken from '../utilities/decodeAuthenticationToken.js';
import validateUserRequest from '../utilities/validateUserRequest.js';
import validateAdminRequest from '../utilities/validateAdminRequest.js';
import validatePermission from '../utilities/validatePermission.js';
import loggerService from '../service/logger.service.js';

const AUTH_HEADER = 'authorization';

// Helper to create error response data
const createErrorData = (message, status, route) => ({
    timeStamp: new Date(),
    success: false,
    data: {},
    message,
    status,
    route,
});

// Check authorization status
const checkAuthorization = async (userId) => {
    const isValidUser = await validateUserRequest(userId);
    const isValidAdmin = await validateAdminRequest(userId);

    return isValidUser || isValidAdmin;
};

// Function to process authentication and authorization with optional permissions
const authenticateMiddleware = (requiredPermission = null) => async (req, res, next) => {
    loggerService.debug(`Starting authentication for route ${req.originalUrl}`);

    const token = await getAuthenticationToken(req.headers[AUTH_HEADER]);

    // Early exit if no token is provided
    if (!token) {
        loggerService.error('No authentication token provided.');

        return res.status(httpStatus.FORBIDDEN).send(
            createErrorData(
                'Access forbidden. No token provided.',
                httpStatus.FORBIDDEN,
                req.originalUrl
            )
        );
    }

    try {
        const decodedData = await decodeAuthenticationToken(token);
        if (!decodedData) {
            loggerService.error('Token decoding failed. Invalid token provided.');

            throw new Error('Invalid token.');
        }

        const requester = decodedData.currentUser._id;
        const isAuthorized = await checkAuthorization(requester);
        // Early exit if not authorized
        if (!isAuthorized) {
            loggerService.warn(`Authorization failed for user ID: ${requester}`);

            return res.status(httpStatus.UNAUTHORIZED).send(
                createErrorData(
                    'Unauthorized access.',
                    httpStatus.UNAUTHORIZED,
                    req.originalUrl
                )
            );
        }

        if (requiredPermission) {
            const hasPermission = await validatePermission(decodedData.currentUser.permissions, requiredPermission);
            if (!hasPermission) {
                loggerService.warn(`Permission check failed for user ID: ${requester} on permission: ${requiredPermission}`);

                return res.status(httpStatus.UNAUTHORIZED).send(
                    createErrorData(
                        'Insufficient permissions.',
                        httpStatus.UNAUTHORIZED,
                        req.originalUrl
                    )
                );
            }
        } else {
            loggerService.info(`No specific permissions required for access to route ${req.originalUrl}`);
        }

        req.sessionUser = decodedData;  // Attach user info to the request

        loggerService.info(`Authentication successful for user ID: ${requester}`);

        next();
    } catch (error) {
        loggerService.error(`Authentication error: ${error.message} at ${req.originalUrl}`);

        return res.status(httpStatus.FORBIDDEN).send(
            createErrorData(
                `Your session has expired or the token is invalid: ${error.message}. Please login again.`,
                httpStatus.FORBIDDEN,
                req.originalUrl
            )
        );
    }
};

export default authenticateMiddleware;
