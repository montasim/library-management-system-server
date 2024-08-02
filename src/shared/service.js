import errorResponse from '../utilities/errorResponse.js';
import httpStatus from '../constant/httpStatus.constants.js';
import sendResponse from '../utilities/sendResponse.js';
import loggerService from '../service/logger.service.js';
import toSentenceCase from '../utilities/toSentenceCase.js';
import AdminActivityLoggerModel
    from '../modules/api/admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants
    from '../modules/api/admin/adminActivityLogger/adminActivityLogger.constants.js';

const getResourceById = async (model, populateMethod, resourceId, resourceType) => {
    try {
        const capitalizeResourceType = toSentenceCase(resourceType);
        const resource = await populateMethod(model.findById(resourceId));
        if (!resource) {
            return errorResponse(`${capitalizeResourceType} not found.`, httpStatus.NOT_FOUND);
        }

        return sendResponse(
            resource,
            `${capitalizeResourceType} fetched successfully.`,
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

const deleteResourceById = async (requester, Model, resourceId, resourceType) => {
    try {
        const capitalizeResourceType = toSentenceCase(resourceType);
        const deletedResource = await Model.findByIdAndDelete(resourceId);

        if (!deletedResource) {
            return sendResponse({}, `${capitalizeResourceType} not found.`, httpStatus.NOT_FOUND);
        }

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `${capitalizeResourceType} deleted successfully.`,
            details: JSON.stringify(deletedResource),
            affectedId: resourceId,
        });

        return sendResponse({}, `${capitalizeResourceType} deleted successfully.`, httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to delete ${resourceType}: ${error}`);

        return errorResponse(
            error.message || `Failed to delete ${resourceType}.`,
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const service = {
    getResourceById,
    deleteResourceById
};


export default service;
