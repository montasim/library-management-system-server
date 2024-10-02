import TermsAndConditionsModel from './termsAndConditions.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import AdminActivityLoggerModel
    from '../../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants
    from '../../admin/adminActivityLogger/adminActivityLogger.constants.js';
import loggerService from '../../../../service/logger.service.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';

const populateTermsAndConditionsFields = async (query) => {
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

const termsAndConditionsListParamsMapping = {};

const createOrUpdateTermsAndConditions = async (requester, newTermsAndConditionsData) => {
    try {
        newTermsAndConditionsData.createdBy = requester;

        // Check if an TermsAndConditions document already exists
        const existingTermsAndConditions = await TermsAndConditionsModel.findOne();

        let termsAndConditions;
        if (existingTermsAndConditions) {
            // If an TermsAndConditions already exists, update it
            existingTermsAndConditions.details = newTermsAndConditionsData.details;
            existingTermsAndConditions.updatedBy = requester; // Update the `updatedBy` field
            termsAndConditions = await existingTermsAndConditions.save(); // Save the updated document
        } else {
            // If no TermsAndConditions exists, create a new one
            termsAndConditions = await TermsAndConditionsModel.create(newTermsAndConditionsData);
        }

        // Populate necessary fields after creation or update
        const populatedTermsAndConditions = await populateTermsAndConditionsFields(
            TermsAndConditionsModel.findById(termsAndConditions._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newTermsAndConditionsData.details} created or updated successfully.`,
            details: JSON.stringify(populatedTermsAndConditions),
        });

        return sendResponse(
            populatedTermsAndConditions,
            'Terms and conditions created or updated successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create or update terms and conditions: ${error}`);

        return errorResponse(
            error.message || 'Failed to create or update terms and conditions.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getTermsAndConditions = async (params) => {
    try {
        // Aggregation pipeline to fetch terms and conditions and populate createdBy and updatedBy fields
        const termsAndConditionsData = await TermsAndConditionsModel.aggregate([
            {
                // Lookup stage to populate the createdBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'createdBy', // Field in the TermsAndConditions collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'createdBy', // Output array name
                },
            },
            {
                // Lookup stage to populate the updatedBy field from the Admins collection
                $lookup: {
                    from: 'admins', // Name of the admins (or users) collection
                    localField: 'updatedBy', // Field in the TermsAndConditions collection
                    foreignField: '_id', // Matching field in the Admins collection
                    as: 'updatedBy', // Output array name
                },
            },
            {
                // Unwind createdBy and updatedBy fields to convert them from arrays to objects
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true, // Keeps the terms and conditions even if createdBy is null
                },
            },
            {
                $unwind: {
                    path: '$updatedBy',
                    preserveNullAndEmptyArrays: true, // Keeps the terms and conditions even if updatedBy is null
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

        if (!termsAndConditionsData || termsAndConditionsData.length === 0) {
            return sendResponse({}, 'No terms and conditions content found.', httpStatus.OK);
        }

        return sendResponse(
            {
                ...termsAndConditionsData[0], // Return the first (and likely only) document in the response
            },
            'Terms and conditions fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to fetch terms and conditions: ${error}`);

        return errorResponse(
            error.message || 'Failed to fetch terms and conditions.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteTermsAndConditions = async (requester) => {
    try {
        // Delete all documents from the TermsAndConditions collection
        const result = await TermsAndConditionsModel.deleteMany({});

        // Log the deletion activity
        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.DELETE,
            description: `All terms and conditions content deleted successfully.`,
            details: `Deleted ${result.deletedCount} documents from terms and conditions collection.`,
        });

        return sendResponse(
            {},
            `All terms and conditions content deleted successfully. Deleted ${result.deletedCount} documents.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to delete all terms and conditions content: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete all terms and conditions content.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const termsAndConditionsService = {
    createTermsAndConditions: createOrUpdateTermsAndConditions,
    getTermsAndConditions,
    updateTermsAndConditions: createOrUpdateTermsAndConditions,
    deleteTermsAndConditions,
};

export default termsAndConditionsService;
