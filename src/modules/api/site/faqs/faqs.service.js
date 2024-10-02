import FaqsModel from './faqs.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import loggerService from '../../../../service/logger.service.js';
import RolesModel from '../../roles/roles.model.js';
import constants from '../../../../constant/constants.js';
import service from '../../../../shared/service.js';
import AdminActivityLoggerModel from '../../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants from '../../admin/adminActivityLogger/adminActivityLogger.constants.js';

import errorResponse from '../../../../utilities/errorResponse.js';
import sendResponse from '../../../../utilities/sendResponse.js';
import isEmptyObject from '../../../../utilities/isEmptyObject.js';

const populateFaqFields = async (query) => {
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

const permissionListParamsMapping = {};

const createFaq = async (requester, newFaqData) => {
    try {
        const exists = await FaqsModel.exists({
            name: newFaqData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Faq name "${newFaqData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        newFaqData.createdBy = requester;

        const newFaq = await FaqsModel.create(newFaqData);

        // add new faq to the admin role
        const adminRoleDetails = await RolesModel.findOne({
            name: constants.defaultName.adminRole,
        }).lean();
        if (adminRoleDetails) {
            // Role exists, update it by adding the new faq
            await RolesModel.updateOne(
                { _id: adminRoleDetails._id },
                {
                    $addToSet: { faqs: newFaq._id },
                }
            );
        } else {
            // Role does not exist, create it with the new faq
            const newRole = new RolesModel({
                name: constants.defaultName.adminRole,
                faqs: [newFaq._id], // Use an array to initialize faqs
                createdBy: requester,
            });

            await newRole.save();
        }

        // Populate the necessary fields after creation
        const populatedFaq = await populateFaqFields(
            FaqsModel.findById(newFaq._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newFaqData.name} created successfully.`,
            details: JSON.stringify(populatedFaq),
        });

        return sendResponse(
            populatedFaq,
            'Faq created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create faq: ${error}`);

        return errorResponse(
            error.message || 'Failed to create faq.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getFaqList = async (requester, params) => {
    return service.getResourceList(
        FaqsModel,
        populateFaqFields,
        params,
        permissionListParamsMapping,
        'faq'
    );
};

const getFaqById = async (permissionId) => {
    return service.getResourceById(
        FaqsModel,
        populateFaqFields,
        permissionId,
        'Faq'
    );
};

const updateFaqById = async (requester, permissionId, updateData) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        // Attempt to update the faq
        const updatedFaq = await FaqsModel.findByIdAndUpdate(
            permissionId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedFaq) {
            return sendResponse(
                {},
                'Faq not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedFaq = await populateFaqFields(
            FaqsModel.findById(updatedFaq._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${permissionId} updated successfully.`,
            details: JSON.stringify(populatedFaq),
            affectedId: permissionId,
        });

        return sendResponse(
            populatedFaq,
            'Faq updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        // Handle specific errors, like duplicate names, here
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return sendResponse(
                {},
                `Faq name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        loggerService.error(`Failed to update faq: ${error}`);

        return errorResponse(
            error.message || 'Failed to update faq.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteFaqList = async (requester, permissionIds) => {
    return await service.deleteResourcesByList(
        requester,
        FaqsModel,
        permissionIds,
        'faq'
    );
};

const deleteFaqById = async (requester, permissionId) => {
    return service.deleteResourceById(
        requester,
        FaqsModel,
        permissionId,
        'faq'
    );
};

const faqsService = {
    createFaq,
    getFaqList,
    getFaqById,
    updateFaqById,
    deleteFaqList,
    deleteFaqById,
};

export default faqsService;
