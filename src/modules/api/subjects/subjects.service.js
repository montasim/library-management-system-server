import SubjectsModel from './subjects.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import logger from '../../../utilities/logger.js';

const createSubject = async (requester, subjectData) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create subjects.',
                httpStatus.FORBIDDEN
            );
        }

        const exists = await SubjectsModel.findOne({
            name: subjectData.name,
        }).lean();
        if (exists) {
            return sendResponse(
                {},
                `Subject name "${subjectData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        subjectData.createdBy = requester;

        const newSubject = await SubjectsModel.create(subjectData);

        return sendResponse(
            newSubject,
            'Subject created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        logger.error(`Failed to create subject: ${error}`);

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
        const subjects = await SubjectsModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

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
        logger.error(`Failed to get subjects: ${error}`);

        return errorResponse(
            error.message || 'Failed to get subjects.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getSubject = async (subjectId) => {
    try {
        const subject = await SubjectsModel.findById(subjectId);
        if (!subject) {
            return errorResponse('Subject not found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            subject,
            'Subject fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to get subject: ${error}`);

        return errorResponse(
            error.message || 'Failed to get subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updateSubject = async (requester, subjectId, updateData) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to update subjects.',
                httpStatus.FORBIDDEN
            );
        }

        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        const exists = await SubjectsModel.findOne({
            name: updateData.name,
        }).lean();
        if (exists) {
            return sendResponse(
                {},
                `Subject name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        const updatedSubject = await SubjectsModel.findByIdAndUpdate(
            subjectId,
            updateData,
            {
                new: true,
            }
        );
        if (!updatedSubject) {
            return sendResponse({}, 'Subject not found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            updatedSubject,
            'Subject updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        logger.error(`Failed to update subject: ${error}`);

        return errorResponse(
            error.message || 'Failed to update subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteSubjects = async (requester, subjectIds) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to delete subjects.',
                httpStatus.FORBIDDEN
            );
        }

        // First, check which permissions exist
        const existingSubjects = await SubjectsModel.find({
            _id: { $in: subjectIds },
        })
            .select('_id')
            .lean();

        const existingIds = existingSubjects.map((p) => p._id.toString());
        const notFoundIds = subjectIds.filter(
            (id) => !existingIds.includes(id)
        );

        // Perform deletion on existing permissions only
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
        logger.error(`Failed to delete subjects: ${error}`);

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
        logger.error(`Failed to delete subject: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const subjectsService = {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsService;
