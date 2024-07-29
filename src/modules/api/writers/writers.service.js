import WritersModel from './writers.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import GoogleDriveService from '../../../service/googleDrive.service.js';
import validateUserRequest from '../../../utilities/validateUserRequest.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../constant/fileExtensions.constants.js';
import writersConstant from './writers.constant.js';
import deleteResourceById from '../../../shared/deleteResourceById.js';
import loggerService from '../../../service/logger.service.js';

const createWriter = async (requester, writerData, writerImage) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to create writer.',
                httpStatus.FORBIDDEN
            );
        }

        const exists = await WritersModel.findOne({
            name: writerData.name,
        }).lean();
        if (exists) {
            return sendResponse(
                {},
                `Writers name "${writerData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        if (!writerImage) {
            return errorResponse(
                'Please provide an image.',
                httpStatus.BAD_REQUEST
            );
        }

        const fileValidationResults = validateFile(
            writerImage,
            writersConstant.imageSize,
            [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
            [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
        );
        if (!fileValidationResults.isValid) {
            return errorResponse(
                fileValidationResults.message,
                httpStatus.BAD_REQUEST
            );
        }

        const writerImageData =
            await GoogleDriveService.uploadFile(writerImage);
        if (!writerImageData || writerImageData instanceof Error) {
            return errorResponse(
                'Failed to save image.',
                httpStatus.INTERNAL_SERVER_ERROR
            );
        }

        writerData.createdBy = requester;

        const newWriter = await WritersModel.create({
            ...writerData,
            image: writerImageData,
        });

        return sendResponse(
            newWriter,
            'Writer created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create writer: ${error}`);

        return errorResponse(
            error.message || 'Failed to create writer.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getWriters = async (params) => {
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
        const totalWriters = await WritersModel.countDocuments(query);
        const totalPages = Math.ceil(totalWriters / limit);
        const writers = await WritersModel.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!writers.length) {
            return sendResponse({}, 'No writer found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            {
                permissions: writers,
                totalPermissions: totalWriters,
                totalPages,
                currentPage: page,
                pageSize: limit,
                sort,
            },
            `${writers.length} writers fetched successfully.`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get writers: ${error}`);

        return errorResponse(
            error.message || 'Failed to get writers.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const getWriter = async (writerId) => {
    try {
        const writer = await WritersModel.findById(writerId);
        if (!writer) {
            return errorResponse('Writer not found.', httpStatus.NOT_FOUND);
        }

        return sendResponse(
            writer,
            'Writer fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to get writer: ${error}`);

        return errorResponse(
            error.message || 'Failed to get writer.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const updateWriter = async (requester, writerId, updateData, writerImage) => {
    try {
        const isAuthorized = await validateUserRequest(requester);
        if (!isAuthorized) {
            return errorResponse(
                'You are not authorized to update writer.',
                httpStatus.FORBIDDEN
            );
        }

        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        if (!writerImage) {
            return errorResponse(
                'Please provide an image.',
                httpStatus.BAD_REQUEST
            );
        }

        const fileValidationResults = validateFile(
            writerImage,
            writersConstant.imageSize,
            [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
            [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
        );
        if (!fileValidationResults.isValid) {
            return errorResponse(
                fileValidationResults.message,
                httpStatus.BAD_REQUEST
            );
        }

        const existingWriter = await WritersModel.findById(writerId).lean();

        updateData.updatedBy = requester;

        let writerImageData;
        // Delete the old file from Google Drive if it exists
        const oldFileId = existingWriter.image?.fileId;
        if (oldFileId) {
            await GoogleDriveService.deleteFile(oldFileId);
        }

        writerImageData = await GoogleDriveService.uploadFile(writerImage);

        if (!writerImageData || writerImageData instanceof Error) {
            return errorResponse(
                'Failed to save image.',
                httpStatus.INTERNAL_SERVER_ERROR
            );
        }

        writerImageData = {
            fileId: writerImageData.fileId,
            shareableLink: writerImageData.shareableLink,
            downloadLink: writerImageData.downloadLink,
        };

        if (writerImageData) {
            updateData.image = writerImageData;
        }

        const updatedWriter = await WritersModel.findByIdAndUpdate(
            writerId,
            updateData,
            {
                new: true,
            }
        );

        return sendResponse(
            updatedWriter,
            'Writer updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update writer: ${error}`);

        return errorResponse(
            error.message || 'Failed to update writer.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteWriters = async (requester, writerIds) => {
    try {
        const isAuthorized = await validateUserRequest(requester);

        if (!isAuthorized) {
            return errorResponse('User not authorized.', httpStatus.FORBIDDEN);
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
                    await GoogleDriveService.deleteFile(oldFileId);
                }

                const deletedWriter =
                    await WritersModel.findByIdAndDelete(writerId);

                if (deletedWriter) {
                    results.deleted.push(writerId);
                }
            } catch (error) {
                // Log the error and mark this ID as failed
                loggerService.error(
                    `Failed to delete writer with ID ${writerId}: ${error}`
                );
                results.failed.push(writerId);
            }
        }

        return sendResponse(
            results,
            `Deleted ${results.deleted.length}, Not found ${results.notFound.length}, Failed ${results.failed.length}`,
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to delete writers: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete writers.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

const deleteWriter = async (requester, writerId) => {
    try {
        return deleteResourceById(requester, writerId, WritersModel, 'writer');
    } catch (error) {
        loggerService.error(`Failed to delete writer: ${error}`);

        return errorResponse(
            error.message || 'Failed to delete writer.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
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
