import environment from '../constant/envTypes.constants.js';
import httpStatus from '../constant/httpStatus.constants.js';
import errorCodes from '../constant/errorCodes.constants.js';
import loggerService from './logger.service.js';

const errorHandlingService = (error, req, res, next) => {
    let message;
    let status = error.status || httpStatus.INTERNAL_SERVER_ERROR;

    // Log detailed error information in development for debugging
    if (process.env.NODE_ENV === environment.DEVELOPMENT) {
        loggerService.error('Detailed Error:', {
            error,
            body: req.body,
            path: req.path,
        });
    }

    // Handle specific common errors
    switch (error.name) {
        case 'ValidationError':
            status = httpStatus.BAD_REQUEST;
            message = Object.values(error.errors)
                .map((err) => err.message)
                .join(', ');
            break;
        case 'CastError':
            status = httpStatus.BAD_REQUEST;
            message = `Invalid ${error.path}: ${error.value}`;
            break;
        case 'UnauthorizedError':
            status = httpStatus.UNAUTHORIZED;
            message =
                'Unauthorized: Access is denied due to invalid credentials.';
            break;
        case 'ForbiddenError':
            status = httpStatus.FORBIDDEN;
            message =
                'Forbidden: You do not have permission to access this resource.';
            break;
        case 'OverwriteModelError':
            status = httpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal Server Error: Model Overwrite Attempted.';
            break;
        case 'MongoServerError':
            // Handle specific MongoDB server errors
            if (error.code === 11000) {
                status = httpStatus.CONFLICT;
                message =
                    'Duplicate key error: An item with the same value already exists.';
            } else {
                status = httpStatus.INTERNAL_SERVER_ERROR;
                message = 'MongoDB Server Error';
            }
            break;
        case 'NotFoundError':
            status = httpStatus.NOT_FOUND;
            message = error.message || 'The requested resource was not found.';
            break;
        case 'MulterError':
            if (error.code === 'LIMIT_FILE_SIZE') {
                status = httpStatus.BAD_REQUEST;
                message =
                    'File too large: The file you are trying to upload exceeds the maximum allowed size.';
            } else {
                message = error.message || 'Error occurred during file upload.';
            }
            break;
        default:
            message =
                process.env.NODE_ENV === environment.PRODUCTION
                    ? 'An unexpected error occurred'
                    : error.message;
            break;
    }

    if (error.code === errorCodes.ECONNREFUSED) {
        status = httpStatus.SERVICE_UNAVAILABLE;
        message = 'Service temporarily unavailable. Please try again later.';
    }

    // Operational errors are handled here
    if (error.isOperational) {
        message = error.message; // Use a more user-friendly message
    } else {
        // Log non-operational errors more aggressively
        loggerService.error('Non-operational error:', {
            message: error.message,
            stack: error.stack,
        });
    }

    // Construct a unified response object
    const response = {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: false,
        data: {},
        message,
        status,
    };

    // Optionally add error stack in non-production environments for detailed debugging
    if (
        process.env.NODE_ENV !== environment.PRODUCTION &&
        !error.isOperational
    ) {
        response.data.stack = error.stack;
    }

    res.status(status).send(response);
};

export default errorHandlingService;
