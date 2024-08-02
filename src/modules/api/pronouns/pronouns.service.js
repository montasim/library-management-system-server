import PronounsModel from './pronouns.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';

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
        const pronounsList = await populatePronounsFields(
            PronounsModel.find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
        );

        if (!pronounsList.length) {
            return sendResponse({}, 'No pronouns found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            {
                pronouns: pronounsList,
                totalPronouns,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${pronounsList.length} pronouns fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to get pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getPronounsById = async (pronounsId) => {
    return service.getResourceById(PronounsModel, populatePronounsFields, pronounsId, 'Pronouns');
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
    try {
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
        loggerService.error(`Failed to delete pronouns: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete pronouns.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
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
