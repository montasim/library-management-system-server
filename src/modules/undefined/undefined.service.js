import httpStatus from '../../constant/httpStatus.constants.js';
import errorResponse from '../../utilities/errorResponse.js';
import sendResponse from '../../utilities/sendResponse.js';
import logger from '../../utilities/logger.js';

const undefinedService = () => {
    try {
        return sendResponse({}, 'Invalid route!', httpStatus.NOT_FOUND);
    } catch (error) {
        logger.error(`Failed to process request: ${error}`);

        return errorResponse(
            error.message || 'Failed to process request.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

export default undefinedService;
