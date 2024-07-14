import httpStatus from '../../constant/httpStatus.constants.js';
import errorResponse from '../../utilities/errorResponse.js';
import sendResponse from '../../utilities/sendResponse.js';

const undefinedService = (req) => {
    try {
        return sendResponse(
            {},
            'Invalid route!',
            httpStatus.NOT_FOUND
        );
    } catch (error) {
        return errorResponse(
            error.message || 'Failed to process request.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

export default undefinedService;
