import validateUserRequest from '../utilities/validateUserRequest.js';
import errorResponse from '../utilities/errorResponse.js';
import httpStatus from '../constant/httpStatus.constants.js';
import sendResponse from '../utilities/sendResponse.js';
import toSentenceCase from '../utilities/toSentenceCase.js';

const deleteResourceById = async (
    requester,
    resourceId,
    model,
    resourceType
) => {
    const isAuthorized = await validateUserRequest(requester);
    if (!isAuthorized) {
        return errorResponse(
            `You are not authorized to delete ${resourceType}.`,
            httpStatus.FORBIDDEN
        );
    }

    const deletedResource = await model.findByIdAndDelete(resourceId);
    if (!deletedResource) {
        return sendResponse(
            {},
            `${toSentenceCase(resourceType)} not found.`,
            httpStatus.NOT_FOUND
        );
    }

    return sendResponse(
        {},
        `${toSentenceCase(resourceType)} deleted successfully.`,
        httpStatus.OK
    );
};

export default deleteResourceById;
