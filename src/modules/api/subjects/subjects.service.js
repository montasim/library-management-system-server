import SubjectsModel from './subjects.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';

const createSubject = async (subjectData) => {
    try {
        subjectData.createdBy = 'Admin'; // Hardcoded for now, will be dynamic in future

        const newSubject = await SubjectsModel.create(subjectData);

        return {
            timeStamp: new Date(),
            success: true,
            data: newSubject,
            message: 'Subject created successfully.',
            status: httpStatus.CREATED,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the subject.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getSubjects = async (params) => {
    const {
        page = 1,
        limit = 10,
        sort = '-createdAt', // Default sort by most recent creation
        name,
        createdBy,
        updatedBy,
        ...otherFilters
    } = params;

    const query = {};

    // Constructing query filters based on parameters
    if (name) query.name = { $regex: name, $options: 'i' };
    if (createdBy) query.createdBy = { $regex: createdBy, $options: 'i' };
    if (updatedBy) query.updatedBy = { $regex: updatedBy, $options: 'i' };

    try {
        const totalSubjects = await SubjectsModel.countDocuments(query);
        const totalPages = Math.ceil(totalSubjects / limit);

        // Adjust the limit if it exceeds the total number of subjects
        const adjustedLimit = Math.min(limit, totalSubjects - (page - 1) * limit);

        const subjects = await SubjectsModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit);

        return {
            timeStamp: new Date(),
            success: true,
            data: {
                subjects,
                totalSubjects,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            message: subjects.length
                ? `${subjects.length} subjects fetched successfully.`
                : 'No subjects found.',
            status: httpStatus.OK,
        };
    } catch (error) {
        logger.error('Error fetching subjects:', error);

        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Failed to fetch subjects.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const getSubject = async (subjectId) => {
    const subject = await SubjectsModel.findById(subjectId);

    if (!subject) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Subject not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: subject,
        message: 'Subject fetched successfully.',
        status: httpStatus.OK,
    };
};

const updateSubject = async (subjectId, updateData) => {
    updateData.updatedBy = 'Admin'; // Hardcoded for now, will be dynamic in future

    const updatedSubject = await SubjectsModel.findByIdAndUpdate(subjectId, updateData, {
        new: true,
    });

    if (!updatedSubject) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Subject not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: updatedSubject,
        message: 'Subject updated successfully.',
        status: httpStatus.OK,
    };
};

const deleteSubjects = async (subjectIds) => {
    const results = {
        deleted: [],
        notFound: [],
        failed: [],
    };

    // Process each subjectId
    for (const subjectId of subjectIds) {
        try {
            const subject = await SubjectsModel.findByIdAndDelete(subjectId);
            if (subject) {
                results.deleted.push(subjectId);
            } else {
                results.notFound.push(subjectId);
            }
        } catch (error) {
            // Log the error and mark this ID as failed
            logger.error(`Failed to delete subject with ID ${subjectId}: ${error}`);
            results.failed.push(subjectId);
        }
    }

    return {
        timeStamp: new Date(),
        success: results.failed.length === 0, // Success only if there were no failures
        data: results,
        message: `Deleted ${results.deleted.length}, Not found ${results.notFound.length}, Failed ${results.failed.length}`,
        status: httpStatus.OK,
    };
};

const deleteSubject = async (subjectId) => {
    const subject = await SubjectsModel.findByIdAndDelete(subjectId);

    if (!subject) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Subject not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Subject deleted successfully.',
        status: httpStatus.OK,
    };
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
