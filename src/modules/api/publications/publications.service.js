import PublicationsModel from './publications.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import sendResponse from '../../../utilities/sendResponse.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';

const createPublication = async (requester, publicationData) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create publications.',
                httpStatus.FORBIDDEN
            );
        }

        const exists = await PublicationsModel.findOne({
            name: publicationData.name,
        }).lean();
        if (exists) {
            return sendResponse(
                {},
                `Publication name "${publicationData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        publicationData.createdBy = requester;

        const newPublication = await PublicationsModel.create(publicationData);

        return sendResponse(
            newPublication,
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

const getPublications = async (params) => {
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
        const publications = await PublicationsModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

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

const getPublication = async (publicationId) => {
    try {
        const publication = await PublicationsModel.findById(publicationId);
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

const updatePublication = async (requester, publicationId, updateData) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
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

        const exists = await PublicationsModel.findOne({
            name: updateData.name,
        }).lean();
        if (exists) {
            return sendResponse(
                {},
                `Publication name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        const updatedPublication = await PublicationsModel.findByIdAndUpdate(
            publicationId,
            updateData,
            {
                new: true,
            }
        );
        if (!updatedPublication) {
            return sendResponse(
                {},
                'Publication not found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            updatedPublication,
            'Publication updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update publication: ${error}`);

        return errorResponse(
            error.message || 'Failed to update publication.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePublications = async (requester, publicationIds) => {
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

const deletePublication = async (requester, publicationId) => {
    try {
        return deleteResourceById(
            requester,
            publicationId,
            PublicationsModel,
            'publication'
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
    getPublications,
    getPublication,
    updatePublication,
    deletePublications,
    deletePublication,
};

export default publicationsService;
