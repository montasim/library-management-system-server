import WritersModel from './writers.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';

const createWriter = async (writerData) => {
    try {
        writerData.createdBy = 'Admin'; // Hardcoded for now, will be dynamic in future

        const newWriter = await WritersModel.create(writerData);

        return {
            timeStamp: new Date(),
            success: true,
            data: newWriter,
            message: 'Writer created successfully.',
            status: httpStatus.CREATED,
        };
    } catch (error) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: error.message || 'Error creating the writer.',
            status: httpStatus.BAD_REQUEST,
        };
    }
};

const getWriters = async (params) => {
    const {
        page = 1,
        limit = 10,
        sort = '-createdAt', // Default sort by most recent creation
        name,
        review,
        summary,
        createdBy,
        updatedBy,
        ...otherFilters
    } = params;

    const query = {};

    // Constructing query filters based on parameters
    if (name) query.name = { $regex: name, $options: 'i' };
    if (review) query.review = review;
    if (summary) query.summary = { $regex: summary, $options: 'i' };
    if (createdBy) query.createdBy = { $regex: createdBy, $options: 'i' };
    if (updatedBy) query.updatedBy = { $regex: updatedBy, $options: 'i' };

    try {
        const totalWriters = await WritersModel.countDocuments(query);
        const totalPages = Math.ceil(totalWriters / limit);

        // Adjust the limit if it exceeds the total number of writers
        const adjustedLimit = Math.min(
            limit,
            totalWriters - (page - 1) * limit
        );

        const writers = await WritersModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(adjustedLimit);

        return {
            timeStamp: new Date(),
            success: true,
            data: {
                writers,
                totalWriters,
                totalPages,
                currentPage: page,
                pageSize: adjustedLimit,
                sort,
            },
            message: writers.length
                ? `${writers.length} writers fetched successfully.`
                : 'No writers found.',
            status: httpStatus.OK,
        };
    } catch (error) {
        logger.error('Error fetching writers:', error);

        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Failed to fetch writers.',
            status: httpStatus.INTERNAL_SERVER_ERROR,
        };
    }
};

const getWriter = async (writerId) => {
    const writer = await WritersModel.findById(writerId);

    if (!writer) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Writer not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: writer,
        message: 'Writer fetched successfully.',
        status: httpStatus.OK,
    };
};

const updateWriter = async (writerId, updateData) => {
    updateData.updatedBy = 'Admin'; // Hardcoded for now, will be dynamic in future

    const updatedWriter = await WritersModel.findByIdAndUpdate(
        writerId,
        updateData,
        {
            new: true,
        }
    );

    if (!updatedWriter) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Writer not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: updatedWriter,
        message: 'Writer updated successfully.',
        status: httpStatus.OK,
    };
};

const deleteWriters = async (writerIds) => {
    const results = {
        deleted: [],
        notFound: [],
        failed: [],
    };

    // Process each writerId
    for (const writerId of writerIds) {
        try {
            const writer = await WritersModel.findByIdAndDelete(writerId);
            if (writer) {
                results.deleted.push(writerId);
            } else {
                results.notFound.push(writerId);
            }
        } catch (error) {
            // Log the error and mark this ID as failed
            logger.error(
                `Failed to delete writer with ID ${writerId}: ${error}`
            );
            results.failed.push(writerId);
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

const deleteWriter = async (writerId) => {
    const writer = await WritersModel.findByIdAndDelete(writerId);

    if (!writer) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'Writer not found.',
            status: httpStatus.NOT_FOUND,
        };
    }

    return {
        timeStamp: new Date(),
        success: true,
        data: {},
        message: 'Writer deleted successfully.',
        status: httpStatus.OK,
    };
};

const writersService = {
    createWriter,
    getWriters,
    getWriter,
    updateWriter,
    deleteWriters,
    deleteWriter,
};

export default writersService;
