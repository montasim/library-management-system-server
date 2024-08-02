import errorResponse from '../utilities/errorResponse.js';
import httpStatus from '../constant/httpStatus.constants.js';
import sendResponse from '../utilities/sendResponse.js';
import loggerService from '../service/logger.service.js';
import toSentenceCase from '../utilities/toSentenceCase.js';
import AdminActivityLoggerModel
    from '../modules/api/admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants
    from '../modules/api/admin/adminActivityLogger/adminActivityLogger.constants.js';
import GoogleDriveService from '../service/googleDrive.service.js';

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

const deleteResourcesByList = async (requester, model, ids, resourceType) => {
    try {
        const capitalizeResourceType = toSentenceCase(resourceType);
        const existingEntities = await model.find({ _id: { $in: ids } }).select('_id image.fileId').lean();
        const existingIds = existingEntities.map(entity => entity._id.toString());
        const notFoundIds = ids.filter(id => !existingIds.includes(id));

        // Attempt to delete associated images from Google Drive if they exist
        for (const entity of existingEntities) {
            if (entity.image && entity.image.fileId) {
                try {
                    await GoogleDriveService.deleteFile(entity.image.fileId);
                } catch (error) {
                    loggerService.error(`Failed to delete file with ID ${entity.image.fileId} for ${resourceType}: ${error}`);
                    // You may choose to handle this failure differently, e.g., by marking the ID as failed to delete
                }
            }
        }

        const deletionResult = await model.deleteMany({ _id: { $in: existingIds } });
        const results = {
            deleted: deletionResult.deletedCount,
            notFound: notFoundIds.length,
            failed: ids.length - deletionResult.deletedCount - notFoundIds.length
        };

        const message = `Deleted ${results.deleted}: Not found ${results.notFound}, Failed ${results.failed}`;

        // log the delete action for admin activities
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `${capitalizeResourceType} deleted successfully.`,
            details: JSON.stringify(results),
            affectedId: existingEntities.map(entity => entity._id),
        });

        if (results.deleted <= 0) {
            return errorResponse(message, httpStatus.OK);
        }

        return sendResponse({}, message, httpStatus.OK);
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
    deleteResourceById,
    deleteResourcesByList,
};


export default service;
