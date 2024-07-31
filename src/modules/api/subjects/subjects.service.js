import SubjectsModel from './subjects.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import validateAdminRequest from '../../../utilities/validateAdminRequest.js';

const populateSubjectFields = async (query) => {
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

const createSubject = async (requester, newSubjectData) => {
    try {
        const exists = await SubjectsModel.exists({
            name: newSubjectData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Subject name "${newSubjectData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        newSubjectData.createdBy = requester;

        const newSubject = await SubjectsModel.create(newSubjectData);
        // Populate the necessary fields after creation
        const populatedSubject = await populateSubjectFields(
            SubjectsModel.findById(newSubject._id)
        );

        return sendResponse(
            populatedSubject,
            'Subject created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create subject: ${error}`);

        return errorResponse(
            error.message || 'Failed to create subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getSubjects = async (params) => {
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
        const totalSubjects = await SubjectsModel.countDocuments(query);
        const totalPages = Math.ceil(totalSubjects / limit);
        const subjects = await populateSubjectFields(
            SubjectsModel.find(query)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
        );

        if (!subjects.length) {
            return sendResponse({}, 'No subject found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            {
                subjects,
                totalSubjects,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${subjects.length} subjects fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get subjects: ${error}`);

        return errorResponse(
            error.message || 'Failed to get subjects.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getSubjectById = async (subjectId) => {
    try {
        const resource = await populateSubjectFields(
            SubjectsModel.findById(subjectId)
        );
        if (!resource) {
            return errorResponse(`Subject not found.`, httpStatus.NOT_FOUND);
        }

        return sendResponse(
            resource,
            `Subject fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get subject: ${error}`);

        return errorResponse(
            error.message || 'Failed to get subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updateSubject = async (requester, subjectId, updateData) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        // Attempt to update the subject
        const updatedSubject = await SubjectsModel.findByIdAndUpdate(
            subjectId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSubject) {
            return sendResponse({}, 'Subject not found.', httpStatus.NOT_FOUND);
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedSubject = await populateSubjectFields(
            SubjectsModel.findById(updatedSubject._id)
        );

        return sendResponse(
            populatedSubject,
            'Subject updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        // Handle specific errors, like duplicate names, here
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return sendResponse(
                {},
                `Subject name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        loggerService.error(`Failed to update subject: ${error}`);

        return errorResponse(
            error.message || 'Failed to update subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteSubjects = async (requester, subjectIds) => {
    try {
        // First, check which subjects exist
        const existingSubjects = await SubjectsModel.find({
            _id: { $in: subjectIds },
        })
            .select('_id')
            .lean();

        const existingIds = existingSubjects.map((p) => p._id.toString());
        const notFoundIds = subjectIds.filter(
            (id) => !existingIds.includes(id)
        );

        // Perform deletion on existing subjects only
        const deletionResult = await SubjectsModel.deleteMany({
            _id: { $in: existingIds },
        });

        const results = {
            deleted: deletionResult.deletedCount,
            notFound: notFoundIds.length,
            failed:
                subjectIds.length -
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
        loggerService.error(`Failed to delete subjects: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete subjects.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteSubject = async (requester, subjectId) => {
    try {
        return deleteResourceById(
            requester,
            subjectId,
            SubjectsModel,
            'subject'
        );
    } catch (error) {
        loggerService.error(`Failed to delete subject: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const subjectsService = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsService;
