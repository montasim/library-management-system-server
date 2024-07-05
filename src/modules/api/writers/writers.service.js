import WritersModel from './writers.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import logger from '../../../utilities/logger.js';
import GoogleDriveFileOperations from '../../../utilities/googleDriveFileOperations.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';

const createWriter = async (requester, writerData, writerImage) => {
    try {
        const isAuthorized = await validateUserRequest(requester);

        if (!isAuthorized) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'User not authorized.',
                status: httpStatus.FORBIDDEN,
            };
        }

        const oldDetails = await WritersModel.findOne({
            name: writerData.name,
        }).lean();

        if (oldDetails) {
            throw new Error(`Writers "${writerData.name}" already exists.`);
        }

        let writerImageData = {};

        if (writerImage) {
            writerImageData =
                await GoogleDriveFileOperations.uploadFile(writerImage);

            if (!writerImageData || writerImageData instanceof Error) {
                return {
                    timeStamp: new Date(),
                    success: true,
                    data: {},
                    message: 'Failed to save image.',
                    status: httpStatus.INTERNAL_SERVER_ERROR,
                };
            }
        }

        writerData.createdBy = requester;

        const newWriter = await WritersModel.create({
            ...writerData,
            image: writerImageData,
        });

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

const updateWriter = async (requester, writerId, updateData, writerImage) => {
    const isAuthorized = await validateUserRequest(requester);

    if (!isAuthorized) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'User not authorized.',
            status: httpStatus.FORBIDDEN,
        };
    }

    const existingWriter = await WritersModel.findById(writerId).lean();

    updateData.updatedBy = requester;

    let writerImageData = {};

    // Handle file update
    if (writerImage) {
        // Delete the old file from Google Drive if it exists
        const oldFileId = existingWriter.image?.fileId;
        if (oldFileId) {
            await GoogleDriveFileOperations.deleteFile(oldFileId);
        }

        writerImageData =
            await GoogleDriveFileOperations.uploadFile(writerImage);

        if (!writerImageData || writerImageData instanceof Error) {
            return {
                timeStamp: new Date(),
                success: false,
                data: {},
                message: 'Failed to save image.',
                status: httpStatus.INTERNAL_SERVER_ERROR,
            };
        }

        writerImageData = {
            fileId: writerImageData.fileId,
            shareableLink: writerImageData.shareableLink,
            downloadLink: writerImageData.downloadLink,
        };

        if (writerImageData) {
            updateData.image = writerImageData;
        }
    }

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

const deleteWriters = async (requester, writerIds) => {
    const isAuthorized = await validateUserRequest(requester);

    if (!isAuthorized) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'User not authorized.',
            status: httpStatus.FORBIDDEN,
        };
    }

    const results = {
        deleted: [],
        notFound: [],
        failed: [],
    };

    // Process each writerId
    for (const writerId of writerIds) {
        try {
            const writer = await WritersModel.findById(writerId).lean();

            if (!writer) {
                results.notFound.push(writerId);
            }

            // Delete the old file from Google Drive if it exists
            const oldFileId = writer.image?.fileId;
            if (oldFileId) {
                await GoogleDriveFileOperations.deleteFile(oldFileId);
            }

            const deletedWriter =
                await WritersModel.findByIdAndDelete(writerId);

            if (deletedWriter) {
                results.deleted.push(writerId);
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

const deleteWriter = async (requester, writerId) => {
    const isAuthorized = await validateUserRequest(requester);

    if (!isAuthorized) {
        return {
            timeStamp: new Date(),
            success: false,
            data: {},
            message: 'User not authorized.',
            status: httpStatus.FORBIDDEN,
        };
    }

    const existingWriter = await WritersModel.findById(writerId).lean();

    // Delete the old file from Google Drive if it exists
    const oldFileId = existingWriter.image?.fileId;
    if (oldFileId) {
        await GoogleDriveFileOperations.deleteFile(oldFileId);
    }

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
