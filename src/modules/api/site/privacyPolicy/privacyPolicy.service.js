import PrivacyPolicyModel from './privacyPolicy.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import AdminActivityLoggerModel
    from '../../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants
    from '../../admin/adminActivityLogger/adminActivityLogger.constants.js';
import loggerService from '../../../../service/logger.service.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

const populatePrivacyPolicyFields = async (query) => {
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

const privacyPolicyListParamsMapping = {};

const createOrUpdatePrivacyPolicy = async (requester, newPrivacyPolicyData) => {
    try {
        newPrivacyPolicyData.createdBy = requester;

        // Check if an privacy policy document already exists
        const existingPrivacyPolicy = await PrivacyPolicyModel.findOne();

        let privacyPolicy;
        if (existingPrivacyPolicy) {
            // If an privacy policy already exists, update it
            existingPrivacyPolicy.details = newPrivacyPolicyData.details;
            existingPrivacyPolicy.updatedBy = requester; // Update the `updatedBy` field
            privacyPolicy = await existingPrivacyPolicy.save(); // Save the updated document
        } else {
            // If no privacy policy exists, create a new one
            privacyPolicy = await PrivacyPolicyModel.create(newPrivacyPolicyData);
        }

        // Populate necessary fields after creation or update
        const populatedPrivacyPolicy = await populatePrivacyPolicyFields(
            PrivacyPolicyModel.findById(privacyPolicy._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newPrivacyPolicyData.details} created or updated successfully.`,
            details: JSON.stringify(populatedPrivacyPolicy),
        });

        return sendResponse(
            populatedPrivacyPolicy,
            'Privacy policy created or updated successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create or update privacy policy: ${error}`);

        return errorResponse(
            error.message || 'Failed to create or update privacy policy.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPrivacyPolicy = async (params) => {
    try {
        // Aggregation pipeline to fetch privacy policy and populate createdBy and updatedBy fields
        const privacyPolicyData = await PrivacyPolicyModel.aggregate([
            {
                // Lookup stage to populate the createdBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'createdBy', // Field in the privacy policy collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'createdBy', // Output array name
                },
            },
            {
                // Lookup stage to populate the updatedBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'updatedBy', // Field in the privacy policy collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'updatedBy', // Output array name
                },
            },
            {
                // Unwind createdBy and updatedBy fields to convert them from arrays to objects
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true, // Keeps the privacy policy even if createdBy is null
                },
            },
            {
                $unwind: {
                    path: '$updatedBy',
                    preserveNullAndEmptyArrays: true, // Keeps the privacy policy even if updatedBy is null
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

        if (!privacyPolicyData || privacyPolicyData.length === 0) {
            return sendResponse({}, 'No privacy policy content found.', httpStatus.OK);
        }

        return sendResponse(
            {
                ...privacyPolicyData[0], // Return the first (and likely only) document in the response
            },
            'PrivacyPolicy fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to fetch privacy policy: ${error}`);

        return errorResponse(
            error.message || 'Failed to fetch privacy policy.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePrivacyPolicy = async (requester) => {
    try {
        // Delete all documents from the privacy policy collection
        const result = await PrivacyPolicyModel.deleteMany({});

        // Log the deletion activity
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `All privacy policy content deleted successfully.`,
            details: `Deleted ${result.deletedCount} documents from privacy policy collection.`,
        });

        return sendResponse(
            {},
            `All privacy policy content deleted successfully. Deleted ${result.deletedCount} documents.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to delete all privacy policy content: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete all privacy policy content.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const privacyPolicyService = {
    createPrivacyPolicy: createOrUpdatePrivacyPolicy,
    getPrivacyPolicy,
    updatePrivacyPolicy: createOrUpdatePrivacyPolicy,
    deletePrivacyPolicy,
};

export default privacyPolicyService;
