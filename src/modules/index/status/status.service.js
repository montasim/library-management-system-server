import httpStatus from '../../../constant/statusCodes.constants.js';

const statusService = (req) => {
    return {
        route: req.originalUrl,
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Success',
        status: httpStatus.OK,
    };
};

export default statusService;
