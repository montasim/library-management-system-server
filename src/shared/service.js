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

const getResourceList = async (model, populateFields, params, paramsMapping, resourceType) => {
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            requester,
            ...restParams
        } = params;

        // Dynamic query construction with mapping
        const query = Object.keys(restParams).reduce((acc, key) => {
            if (restParams[key] !== undefined) {
                const schemaKey = paramsMapping[key] || key;  // Use mapped key if available, otherwise use the key as is
                // Apply regex pattern for text search fields
                if (['name', 'createdBy', 'updatedBy'].includes(schemaKey)) {
                    acc[schemaKey] = new RegExp(restParams[key], 'i');
                } else {
                    acc[schemaKey] = restParams[key];
                }
            }
            return acc;
        }, {});

        const totalItems = await model.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const items = await populateFields(
            model.find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
        );

        if (!items.length) {
            return sendResponse({}, `No ${resourceType} found.`, httpStatus.NOT_FOUND);
        }

        // await AdminActivityLoggerModel.create({
        //     user: requester,
        //     action: adminActivityLoggerConstants.actionTypes.FETCH,
        //     description: `Fetched ${resourceType} list`,
        //     details: JSON.stringify(items),
        // });

        return sendResponse(
            {
                items,
                totalItems,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${items.length} ${resourceType} fetched successfully.`,
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
        const resource = await Model.findById(resourceId).select('_id image.fileId').lean();

        if (!resource) {
            return sendResponse({}, `${capitalizeResourceType} not found.`, httpStatus.NOT_FOUND);
        }

        // Check if the resource has an associated image file in Google Drive and delete it
        if (resource.image && resource.image.fileId) {
            try {
                await GoogleDriveService.deleteFile(resource.image.fileId);
            } catch (error) {
                loggerService.error(`Failed to delete Google Drive file with ID ${resource.image.fileId} for ${resourceType}: ${error}`);
                // Optional: Decide how to handle errors in file deletion, whether to proceed with deleting the resource or not
            }
        }

        const deletionResult = await Model.findByIdAndDelete(resourceId);

        if (!deletionResult) {
            // This condition might be redundant, consider removing it if you're sure the document exists after the initial find.
            return sendResponse({}, `${capitalizeResourceType} not found.`, httpStatus.NOT_FOUND);
        }

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `${capitalizeResourceType} deleted successfully.`,
            details: JSON.stringify(deletionResult),
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
    getResourceList,
    deleteResourceById,
    deleteResourcesByList,
};


export default service;
