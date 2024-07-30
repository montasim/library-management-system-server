import PublicationsModel from './publications.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import sendResponse from '../../../utilities/sendResponse.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import validateAdminRequest from '../../../utilities/validateAdminRequest.js';

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

const createPublication = async (requester, newPublicationData) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create publication.',
                httpStatus.FORBIDDEN
            );
        }

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
    try {
        const {
            page = 1,
            limit = 10,
            sort = '-createdAt',
            name,
            createdBy,
            updatedBy,
            createdAt,
            updatedAt,
        } = params;
        const query = {
            ...(name && { name: new RegExp(name, 'i') }),
            ...(createdBy && { createdBy }),
            ...(updatedBy && { updatedBy }),
            ...(createdAt && { createdAt }),
            ...(updatedAt && { updatedAt }),
        };
        const totalPublications = await PublicationsModel.countDocuments(query);
        const totalPages = Math.ceil(totalPublications / limit);
        const publications = await populatePublicationFields(
            PublicationsModel.find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
        );

        if (!publications.length) {
            return sendResponse(
                {},
                'No publication found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                publications,
                totalPublications,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${publications.length} publications fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get publications: ${error}`);

        return errorResponse(
            error.message || 'Failed to get publications.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPublicationById = async (publicationId) => {
    try {
        const publication = await populatePublicationFields(
            PublicationsModel.findById(publicationId)
        );
        if (!publication) {
            return errorResponse(
                'Publication not found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            publication,
            'Publication fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get publication: ${error}`);

        return errorResponse(
            error.message || 'Failed to get publication.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updatePublicationById = async (requester, publicationId, updateData) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to update publication.',
                httpStatus.FORBIDDEN
            );
        }

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
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to delete permissions.',
                httpStatus.FORBIDDEN
            );
        }

        // First, check which permissions exist
        const existingPermissions = await PublicationsModel.find({
            _id: { $in: publicationIds },
        })
            .select('_id')
            .lean();

        const existingIds = existingPermissions.map((p) => p._id.toString());
        const notFoundIds = publicationIds.filter(
            (id) => !existingIds.includes(id)
        );

        // Perform deletion on existing permissions only
        const deletionResult = await PublicationsModel.deleteMany({
            _id: { $in: existingIds },
        });

        const results = {
            deleted: deletionResult.deletedCount,
            notFound: notFoundIds.length,
            failed:
                publicationIds.length -
                deletionResult.deletedCount -
                notFoundIds.length,
        };

        // Custom message to summarize the outcome
        const message = `Deleted ${results.deleted}: Not found ${results.notFound}, Failed ${results.failed}`;

        if (results.deleted <= 0) {
            return errorResponse(message, httpStatus.OK);
        }

        return sendResponse({}, message, httpStatus.OK);
    } catch (error) {
        loggerService.error(`Failed to delete publications: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete publications.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePublicationById = async (requester, publicationId) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to delete publication.',
                httpStatus.FORBIDDEN
            );
        }

        const deletedResource =
            await PublicationsModel.findByIdAndDelete(publicationId);
        if (!deletedResource) {
            return sendResponse(
                {},
                'Publication not found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {},
            'Publication deleted successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to delete publication: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete publication.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const publicationsService = {
    createPublication,
    getPublicationList,
    getPublicationById,
    updatePublicationById,
    deletePublicationList,
    deletePublicationById,
};

export default publicationsService;
