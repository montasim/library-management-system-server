import httpStatus from '../constant/statusCodes.constants.js';

const errorHandlingMiddleware = (error, req, res, next) => {
    // Handle specific error types here
    if (error.code === 'ECONNREFUSED') {
        console.error('Connection refused error:', error);

        const errorData = {
            route: req.originalUrl,
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Service temporarily unavailable. Please try again later.',
            status: httpStatus.SERVICE_UNAVAILABLE,
        };

        res.status(errorData.status).send(errorData);
    }

    // Pass other errors to the default error handler
    next(error);
};

export default errorHandlingMiddleware;
