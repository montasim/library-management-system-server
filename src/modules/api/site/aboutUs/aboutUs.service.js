import AboutUsModel from './aboutUs.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import AdminActivityLoggerModel
    from '../../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants
    from '../../admin/adminActivityLogger/adminActivityLogger.constants.js';
import loggerService from '../../../../service/logger.service.js';
import service from '../../../../shared/service.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import isEmptyObject from '../../../../utilities/isEmptyObject.js';
import sendResponse from '../../../../utilities/sendResponse.js';

const populateAboutUsFields = async (query) => {
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

const aboutUsListParamsMapping = {};

const createOrUpdateAboutUs = async (requester, newAboutUsData) => {
    try {
        newAboutUsData.createdBy = requester;

        // Check if an AboutUs document already exists
        const existingAboutUs = await AboutUsModel.findOne();

        let aboutUs;
        if (existingAboutUs) {
            // If an AboutUs already exists, update it
            existingAboutUs.details = newAboutUsData.details;
            existingAboutUs.updatedBy = requester; // Update the `updatedBy` field
            aboutUs = await existingAboutUs.save(); // Save the updated document
        } else {
            // If no AboutUs exists, create a new one
            aboutUs = await AboutUsModel.create(newAboutUsData);
        }

        // Populate necessary fields after creation or update
        const populatedAboutUs = await populateAboutUsFields(
            AboutUsModel.findById(aboutUs._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newAboutUsData.details} created or updated successfully.`,
            details: JSON.stringify(populatedAboutUs),
        });

        return sendResponse(
            populatedAboutUs,
            'AboutUs created or updated successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create or update AboutUs: ${error}`);

        return errorResponse(
            error.message || 'Failed to create or update AboutUs.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getAboutUs = async (params) => {
    try {
        // Aggregation pipeline to fetch aboutUs and populate createdBy and updatedBy fields
        const aboutUsData = await AboutUsModel.aggregate([
            {
                // Lookup stage to populate the createdBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'createdBy', // Field in the AboutUs collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'createdBy', // Output array name
                },
            },
            {
                // Lookup stage to populate the updatedBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'updatedBy', // Field in the AboutUs collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'updatedBy', // Output array name
                },
            },
            {
                // Unwind createdBy and updatedBy fields to convert them from arrays to objects
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true, // Keeps the aboutUs even if createdBy is null
                },
            },
            {
                $unwind: {
                    path: '$updatedBy',
                    preserveNullAndEmptyArrays: true, // Keeps the aboutUs even if updatedBy is null
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

        if (!aboutUsData || aboutUsData.length === 0) {
            return sendResponse({}, 'No aboutUs content found.', httpStatus.OK);
        }

        return sendResponse(
            {
                ...aboutUsData[0], // Return the first (and likely only) document in the response
            },
            'AboutUs fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to fetch aboutUs: ${error}`);

        return errorResponse(
            error.message || 'Failed to fetch aboutUs.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteAboutUs = async (requester) => {
    try {
        // Delete all documents from the AboutUs collection
        const result = await AboutUsModel.deleteMany({});

        // Log the deletion activity
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `All AboutUs content deleted successfully.`,
            details: `Deleted ${result.deletedCount} documents from AboutUs collection.`,
        });

        return sendResponse(
            {},
            `All AboutUs content deleted successfully. Deleted ${result.deletedCount} documents.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to delete all AboutUs content: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete all AboutUs content.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const aboutUsService = {
    createAboutUs: createOrUpdateAboutUs,
    getAboutUs,
    updateAboutUs: createOrUpdateAboutUs,
    deleteAboutUs,
};

export default aboutUsService;
