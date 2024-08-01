import errorResponse from '../utilities/errorResponse.js';
import httpStatus from '../constant/httpStatus.constants.js';
import sendResponse from '../utilities/sendResponse.js';
import toSentenceCase from '../utilities/toSentenceCase.js';

const getResourceById = async (requester, resourceId, model, resourceType) => {
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
