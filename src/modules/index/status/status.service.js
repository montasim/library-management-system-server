import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';

const statusService = (req) => {
    try {
        return sendResponse(
            {},
            'Success',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to get roles: ${error}`);

        return errorResponse(
            error.message || 'Failed to get roles.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

export default statusService;
