import validateUserRequest from '../utilities/validateUserRequest.js';
import errorResponse from '../utilities/errorResponse.js';
import httpStatus from '../constant/httpStatus.constants.js';
import sendResponse from '../utilities/sendResponse.js';
import toSentenceCase from '../utilities/toSentenceCase.js';

const getResourceById = async (requester, resourceId, model, resourceType) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            `You are not authorized to view ${resourceType}.`,
            httpStatus.FORBIDDEN
        );
    }

    const resource = await model.findById(resourceId);
    if (!resource) {
        return errorResponse(
            `${toSentenceCase(resourceType)} not found.`,
            httpStatus.NOT_FOUND
        );
    }

    return sendResponse(
        resource,
        `${toSentenceCase(resourceType)} fetched successfully.`,
        httpStatus.OK
    );
};

export default getResourceById;
