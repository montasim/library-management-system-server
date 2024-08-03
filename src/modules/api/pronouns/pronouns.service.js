import PronounsModel from './pronouns.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';
import AdminActivityLoggerModel
    from '../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants
    from '../admin/adminActivityLogger/adminActivityLogger.constants.js';

const populatePronounsFields = async (query) => {
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

const pronounsListParamsMapping = {};

const createPronouns = async (requester, newPronounsData) => {
    try {
        const exists = await PronounsModel.exists({
            name: newPronounsData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Pronouns name "${newPronounsData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        newPronounsData.createdBy = requester;

        const newPronouns = await PronounsModel.create(newPronounsData);
        // Populate the necessary fields after creation
        const populatedPronouns = await populatePronounsFields(
            PronounsModel.findById(newPronouns._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newPronounsData.name} created successfully.`,
            details: JSON.stringify(populatedPronouns)
        });

        return sendResponse(
            populatedPronouns,
            'Pronouns created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to create pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPronounsList = async (params) => {
    return service.getResourceList(PronounsModel, populatePronounsFields, params, pronounsListParamsMapping, 'pronouns');
};

const getPronounsById = async (pronounsId) => {
    return service.getResourceById(PronounsModel, populatePronounsFields, pronounsId, 'pronouns');
};

const updatePronounsById = async (requester, pronounsId, updateData) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        // Attempt to update the pronouns
        const updatedPronouns = await PronounsModel.findByIdAndUpdate(
            pronounsId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPronouns) {
            return sendResponse(
                {},
                'Pronouns not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedPronouns = await populatePronounsFields(
            PronounsModel.findById(updatedPronouns._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${pronounsId} updated successfully.`,
            details: JSON.stringify(populatedPronouns),
            affectedId: pronounsId,
        });

        return sendResponse(
            populatedPronouns,
            'Pronouns updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        // Handle specific errors, like duplicate names, here
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return sendResponse(
                {},
                `Pronouns name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        loggerService.error(`Failed to update pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to update pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePronounsList = async (requester, pronounsIds) => {
    return await service.deleteResourcesByList(requester, PronounsModel, pronounsIds, 'pronouns');
};

const deletePronounsById = async (requester, pronounsId) => {
    return service.deleteResourceById(requester, PronounsModel, pronounsId, 'pronouns');
};

const pronounsService = {
    createPronouns,
    getPronounsList,
    getPronounsById,
    updatePronounsById,
    deletePronounsList,
    deletePronounsById,
};

export default pronounsService;
