import httpStatus from '../constant/httpStatus.constants.js';

const sendResponse = (data, message, status = httpStatus.OK) => ({
    timeStamp: new Date(),
    success: true,
    data,
    message,
    status,
});

export default sendResponse;
