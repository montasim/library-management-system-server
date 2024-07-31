import getAuthenticationToken from '../utilities/getAuthenticationToken.js';
import httpStatus from '../constant/httpStatus.constants.js';
import decodeAuthenticationToken from '../utilities/decodeAuthenticationToken.js';
import validateUserRequest from '../utilities/validateUserRequest.js';
import validateAdminRequest from '../utilities/validateAdminRequest.js';
import validatePermission from '../utilities/validatePermission.js';
import loggerService from '../service/logger.service.js';
import accessTypesConstants from '../constant/accessTypes.constants.js';

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

// Function to process role-based authentication and authorization with optional permissions
const authenticateMiddleware =
    (roleCheck = accessTypesConstants.BOTH, requiredPermission = null) =>
    async (req, res, next) => {
        loggerService.debug(
            `Starting authentication for route ${req.originalUrl}`
        );

        const token = await getAuthenticationToken(req.headers[AUTH_HEADER]);

        // Early exit if no token is provided
        if (!token) {
            loggerService.error('No authentication token provided.');

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
            if (!decodedData) {
                loggerService.error(
                    'Token decoding failed. Invalid token provided.'
                );

                throw new Error('Invalid token.');
            }

            const requester = decodedData.currentUser._id;
            let isAuthorized;

            switch (roleCheck) {
                case accessTypesConstants.ADMIN:
                    isAuthorized = await validateAdminRequest(requester);
                    break;
                case accessTypesConstants.USER:
                    isAuthorized = await validateUserRequest(requester);
                    break;
                case accessTypesConstants.BOTH:
                    isAuthorized =
                        (await validateUserRequest(requester)) ||
                        (await validateAdminRequest(requester));
                    break;
                default:
                    isAuthorized = false;
            }

            // Early exit if not authorized
            if (!isAuthorized) {
                loggerService.warn(
                    `Authorization failed for user ID: ${requester}`
                );

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

            // Handle permission check if required
            if (requiredPermission) {
                const hasPermission = await validatePermission(
                    decodedData.currentUser.designation,
                    requiredPermission
                );
                if (!hasPermission) {
                    loggerService.warn(
                        `Permission check failed for user ID: ${requester} on permission: ${requiredPermission}`
                    );

                    return res
                        .status(httpStatus.UNAUTHORIZED)
                        .send(
                            createErrorData(
                                'Insufficient permissions.',
                                httpStatus.UNAUTHORIZED,
                                req.originalUrl
                            )
                        );
                }
            } else {
                loggerService.info(
                    `No specific permissions required for access to route ${req.originalUrl}`
                );
            }

            req.sessionUser = decodedData; // Attach user info to the request

            loggerService.info(
                `Authentication successful for user ID: ${requester}`
            );

            next();
        } catch (error) {
            loggerService.error(
                `Authentication error: ${error.message} at ${req.originalUrl}`
            );

            return res
                .status(httpStatus.FORBIDDEN)
                .send(
                    createErrorData(
                        `Your session has expired or the token is invalid: ${error.message}. Please login again.`,
                        httpStatus.FORBIDDEN,
                        req.originalUrl
                    )
                );
        }
    };

export default authenticateMiddleware;
