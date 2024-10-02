import FaqsModel from './faqs.model.js';
import httpStatus from '../../../../constant/httpStatus.constants.js';
import loggerService from '../../../../service/logger.service.js';
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
            question: newFaqData.question
        });
        if (exists) {
            return sendResponse(
                {},
                `Faq question "${newFaqData.question}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        newFaqData.createdBy = requester;

        const newFaq = await FaqsModel.create(newFaqData);

        // Populate the necessary fields after creation
        const populatedFaq = await populateFaqFields(
            FaqsModel.findById(newFaq._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newFaqData.question} created successfully.`,
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

const updateFaqById = async (requester, faqId, updateData) => {
    try {
        console.log(faqId);
        
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        // Attempt to update the FAQ
        const updatedFaq = await FaqsModel.findByIdAndUpdate(
            faqId,
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

        // Optionally populate if necessary (can be skipped if not required)
        const populatedFaq = await populateFaqFields(
            FaqsModel.findById(updatedFaq._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${faqId} updated successfully.`,
            details: JSON.stringify(populatedFaq),
            affectedId: faqId,
        });

        return sendResponse(
            populatedFaq,
            'Faq updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
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
