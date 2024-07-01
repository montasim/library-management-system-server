import httpStatus from '../../constant/httpStatus.constants.js';

const undefinedService = (req) => {
    return {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: false,
        data: {},
        message: 'Invalid route!',
        status: httpStatus.NOT_FOUND,
    };
};

export default undefinedService;
