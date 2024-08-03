import PublicationsModel from './publications.model.js';
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

const populatePublicationFields = async (query) => {
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

const createPublication = async (requester, newPublicationData) => {
    try {
        const exists = await PublicationsModel.exists({
            name: newPublicationData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Publication name "${newPublicationData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        newPublicationData.createdBy = requester;

        const newPublication =
            await PublicationsModel.create(newPublicationData);
        // Populate the necessary fields after creation
        const populatedPublication = await populatePublicationFields(
            PublicationsModel.findById(newPublication._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newPublicationData.name} created successfully.`,
            details: JSON.stringify(populatedPublication)
        });

        return sendResponse(
            populatedPublication,
            'Publication created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create publication: ${error}`);

        return errorResponse(
            error.message || 'Failed to create publication.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPublicationList = async (params) => {
    return service.getResourceList(PublicationsModel, populatePublicationFields, params, pronounsListParamsMapping, 'publication');
};

const getPublicationById = async (publicationId) => {
    return service.getResourceById(PublicationsModel, populatePublicationFields, publicationId, 'publication');
};

const updatePublicationById = async (requester, publicationId, updateData) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        // Attempt to update the publication
        const updatedPublication = await PublicationsModel.findByIdAndUpdate(
            publicationId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPublication) {
            return sendResponse(
                {},
                'Publication not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedPublication = await populatePublicationFields(
            PublicationsModel.findById(updatedPublication._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${publicationId} updated successfully.`,
            details: JSON.stringify(populatedPublication),
            affectedId: publicationId,
        });

        return sendResponse(
            populatedPublication,
            'Publication updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        // Handle specific errors, like duplicate names, here
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return sendResponse(
                {},
                `Publication name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        loggerService.error(`Failed to update publication: ${error}`);

        return errorResponse(
            error.message || 'Failed to update publication.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePublicationList = async (requester, publicationIds) => {
    return await service.deleteResourcesByList(requester, PublicationsModel, publicationIds, 'publication');
};

const deletePublicationById = async (requester, publicationId) => {
    return service.deleteResourceById(requester, PublicationsModel, publicationId, 'publication');
};

const publicationsService = {
    createPublication,
    getPublicationList,
    getPublicationById,
    updatePublicationById,
    deletePublicationById,
    deletePublicationList,
};

export default publicationsService;
