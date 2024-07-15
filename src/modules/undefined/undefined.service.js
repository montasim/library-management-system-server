import httpStatus from '../../constant/httpStatus.constants.js';
import errorResponse from '../../utilities/errorResponse.js';
import sendResponse from '../../utilities/sendResponse.js';
import loggerService from '../../service/logger.service.js';

const undefinedService = () => {
    try {
        return sendResponse({}, 'Invalid route!', httpStatus.NOT_FOUND);
    } catch (error) {
        loggerService.error(`Failed to process request: ${error}`);

        return errorResponse(
            error.message || 'Failed to process request.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

export default undefinedService;
