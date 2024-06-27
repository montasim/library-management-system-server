import httpStatus from '../constant/statusCodes.constants.js';
import ENVIRONMENT from '../constant/envTypes.constants.js';
import ERROR_CODES from '../constant/errorCodes.constants.js';

const errorHandlingMiddleware = (error, req, res, next) => {
    // Set a default status and message in case none is explicitly set by the throwing function
    let { status, message } = error;

    // Log detailed error information in development for debugging
    if (process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT) {
        console.error('Error:', {
            error,
            body: req.body,
            path: req.path
        });
    }

    // Prepare the response object
    const response = {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: false,
        data: process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT && { stack: error.stack },
        message: message,
        status: status,
    };

    // Handle known error types here
    if (error.code === ERROR_CODES.ECONNREFUSED) {
        response.status = httpStatus.SERVICE_UNAVAILABLE;
        response.message = 'Service temporarily unavailable. Please try again later.';
    } else if (error.isOperational) {
        response.message = error.message; // Operational error with a more user-friendly message
    } else {
        // For security reasons, do not send the error details to the client in production
        response.message = process.env.NODE_ENV === ENVIRONMENT.PRODUCTION ? 'An unexpected error occurred' : error.message;
    }

    res.status(response.status).json(response);
};

export default errorHandlingMiddleware;
