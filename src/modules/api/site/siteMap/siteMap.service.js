import SiteMapModel from './siteMap.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import AdminActivityLoggerModel from '../../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants from '../../admin/adminActivityLogger/adminActivityLogger.constants.js';
import loggerService from '../../../../service/logger.service.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

const populateSiteMapFields = async (query) => {
    return await query
        .populate({
            path: 'createdBy',
            select: 'name image department designation isActive',
        })
        .populate({
            path: 'updatedBy',
            select: 'name image department designation isActive',
        });
};

const siteMapListParamsMapping = {};

const createOrUpdateSiteMap = async (
    requester,
    newSiteMapData
) => {
    try {
        newSiteMapData.createdBy = requester;

        // Check if a site Map document already exists
        const existingSiteMap =
            await SiteMapModel.findOne();

        let siteMap;
        if (existingSiteMap) {
            // If an site map already exists, update it
            existingSiteMap.details =
                newSiteMapData.details;
            existingSiteMap.updatedBy = requester; // Update the `updatedBy` field
            siteMap = await existingSiteMap.save(); // Save the updated document
        } else {
            // If no site map exists, create a new one
            siteMap = await SiteMapModel.create(
                newSiteMapData
            );
        }

        // Populate necessary fields after creation or update
        const populatedSiteMap =
            await populateSiteMapFields(
                SiteMapModel.findById(siteMap._id)
            );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newSiteMapData.details} created or updated successfully.`,
            details: JSON.stringify(populatedSiteMap),
        });

        return sendResponse(
            populatedSiteMap,
            'Site map created or updated successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(
            `Failed to create or update site map: ${error}`
        );

        return errorResponse(
            error.message || 'Failed to create or update site map.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getSiteMap = async (params) => {
    try {
        // Aggregation pipeline to fetch site map and populate createdBy and updatedBy fields
        const siteMapData = await SiteMapModel.aggregate([
            {
                // Lookup stage to populate the createdBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'createdBy', // Field in the site map collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'createdBy', // Output array name
                },
            },
            {
                // Lookup stage to populate the updatedBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'updatedBy', // Field in the site map collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'updatedBy', // Output array name
                },
            },
            {
                // Unwind createdBy and updatedBy fields to convert them from arrays to objects
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true, // Keeps the site map even if createdBy is null
                },
            },
            {
                $unwind: {
                    path: '$updatedBy',
                    preserveNullAndEmptyArrays: true, // Keeps the site map even if updatedBy is null
                },
            },
            {
                // Project stage to format the output and include fields
                $project: {
                    _id: 1,
                    details: 1,
                    createdBy: {
                        _id: 1,
                        name: 1, // Adjust fields based on your Admin schema
                        email: 1,
                    },
                    updatedBy: {
                        _id: 1,
                        name: 1, // Adjust fields based on your Admin schema
                        email: 1,
                    },
                },
            },
        ]);

        if (!siteMapData || siteMapData.length === 0) {
            return sendResponse(
                {},
                'No site map content found.',
                httpStatus.OK
            );
        }

        return sendResponse(
            {
                ...siteMapData[0], // Return the first (and likely only) document in the response
            },
            'Site map fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to fetch site map: ${error}`);

        return errorResponse(
            error.message || 'Failed to fetch site map.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteSiteMap = async (requester) => {
    try {
        // Delete all documents from the site map collection
        const result = await SiteMapModel.deleteMany({});

        // Log the deletion activity
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `All site map content deleted successfully.`,
            details: `Deleted ${result.deletedCount} documents from site map collection.`,
        });

        return sendResponse(
            {},
            `All site map content deleted successfully. Deleted ${result.deletedCount} documents.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(
            `Failed to delete all site map content: ${error}`
        );

        return errorResponse(
            error.message ||
                'Failed to delete all site map content.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const siteMapService = {
    createSiteMap: createOrUpdateSiteMap,
    getSiteMap,
    updateSiteMap: createOrUpdateSiteMap,
    deleteSiteMap,
};

export default siteMapService;
