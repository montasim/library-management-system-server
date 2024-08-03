import WritersModel from './writers.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import GoogleDriveService from '../../../service/googleDrive.service.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../constant/fileExtensions.constants.js';
import writersConstant from './writers.constant.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';
import AdminActivityLoggerModel
    from '../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants
    from '../admin/adminActivityLogger/adminActivityLogger.constants.js';

const populateWriterFields = async (query) => {
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

const writerListParamsMapping = {};

const createWriter = async (requester, writerData, writerImage) => {
    try {
        const exists = await WritersModel.exists({ name: writerData.name });
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

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${writerData.name} created successfully.`,
            details: JSON.stringify(newWriter)
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
    return service.getResourceList(WritersModel, populateWriterFields, params, writerListParamsMapping, 'writer');
};

const getWriter = async (writerId) => {
    return service.getResourceById(WritersModel, populateWriterFields, writerId, 'writer');
};

const updateWriter = async (requester, writerId, updateData, writerImage) => {
    try {
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

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${writerId} updated successfully.`,
            details: JSON.stringify(updatedWriter),
            affectedId: writerId,
        });

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
    return await service.deleteResourcesByList(requester, WritersModel, writerIds, 'writer');
};

const deleteWriter = async (requester, writerId) => {
    return service.deleteResourceById(requester, WritersModel, writerId, 'writer');
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
