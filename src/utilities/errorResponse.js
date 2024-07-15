import httpStatus from '../constant/httpStatus.constants.js';

const errorResponse = (message, status = httpStatus.BAD_REQUEST) => ({
    timeStamp: new Date(),
    success: false,
    data: {},
    message,
    status,
});

export default errorResponse;
