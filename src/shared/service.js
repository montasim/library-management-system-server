import errorResponse from '../utilities/errorResponse.js';
import httpStatus from '../constant/httpStatus.constants.js';
import sendResponse from '../utilities/sendResponse.js';
import loggerService from '../service/logger.service.js';
import toSentenceCase from '../utilities/toSentenceCase.js';

const getResourceById = async (model, populateMethod, resourceId, resourceType) => {
    try {
        const resource = await populateMethod(model.findById(resourceId));
        if (!resource) {
            return errorResponse(`${toSentenceCase(resourceType)} not found.`, httpStatus.NOT_FOUND);
        }

        return sendResponse(
            resource,
            `${toSentenceCase(resourceType)} fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get ${resourceType}: ${error}`);

        return errorResponse(
            error.message || `Failed to get ${resourceType}.`,
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};


const service = {
    getResourceById
};


export default service;
