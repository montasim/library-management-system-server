import PronounsModel from './pronouns.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import logger from '../../../utilities/logger.js';
import validateAdminRequest from '../../../utilities/validateAdminRequest.js';

const createPronouns = async (requester, newPronounsData) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create pronouns.',
                httpStatus.FORBIDDEN
            );
        }

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

        return sendResponse(
            newPronouns,
            'Pronouns created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        logger.error(`Failed to create pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to create pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPronounses = async (requester, params) => {
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
        const totalPronouns = await PronounsModel.countDocuments(query);
        const totalPages = Math.ceil(totalPronouns / limit);
        const pronouns = await PronounsModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!pronouns.length) {
            return sendResponse(
                {},
                'No pronouns found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            {
                pronouns,
                totalPronouns,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${pronouns.length} pronouns fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to get pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to get pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPronouns = async (pronounsId) => {
    try {
        const resource = await PronounsModel.findById(pronounsId);
        if (!resource) {
            return errorResponse(
                'Pronouns not found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            resource,
            'Pronouns fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to get pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to get pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updatePronouns = async (requester, pronounsId, updateData) => {
    try {
        const isAuthorized = await validateAdminRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to update pronouns.',
                httpStatus.FORBIDDEN
            );
        }

        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        const exists = await PronounsModel.exists({
            name: updateData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Pronouns name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        const updatedPronouns = await PronounsModel.findByIdAndUpdate(
            pronounsId,
            updateData,
            { new: true }
        );
        if (!updatedPronouns) {
            return sendResponse(
                {},
                'Pronouns not found.',
                httpStatus.NOT_FOUND
            );
        }

        return sendResponse(
            updatedPronouns,
            'Pronouns updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to update pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to update pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePronounses = async (requester, pronounsIds) => {
    try {
        // const isAuthorized = await validateAdminRequest(requester);
        // if (!isAuthorized) {
        //     return errorResponse(
        //         'You are not authorized to delete pronouns.',
        //         httpStatus.FORBIDDEN
        //     );
        // }

        // First, check which pronouns exist
        const existingPronouns = await PronounsModel.find({
            _id: { $in: pronounsIds },
        })
            .select('_id')
            .lean();

        const existingIds = existingPronouns.map((p) => p._id.toString());
        const notFoundIds = pronounsIds.filter(
            (id) => !existingIds.includes(id)
        );

        // Perform deletion on existing pronouns only
        const deletionResult = await PronounsModel.deleteMany({
            _id: { $in: existingIds },
        });

        const results = {
            deleted: deletionResult.deletedCount,
            notFound: notFoundIds.length,
            failed:
                pronounsIds.length -
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
        logger.error(`Failed to delete pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deletePronouns = async (requester, pronounsId) => {
    try {
        return deleteResourceById(
            requester,
            pronounsId,
            PronounsModel,
            'pronouns'
        );
    } catch (error) {
        logger.error(`Failed to delete pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const pronounsService = {
    createPronouns,
    getPronounses,
    getPronouns,
    updatePronouns,
    deletePronounses,
    deletePronouns,
};

export default pronounsService;
