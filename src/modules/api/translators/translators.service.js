/**
 * @fileoverview This module defines the service functions for managing translator-related operations.
 * It includes functions for creating, retrieving, updating, and deleting translator records.
 * The service handles validation, file uploads to Google Drive, and logging of admin activities.
 */

import { v2 as cloudinary } from 'cloudinary';

import TranslatorsModel from './translators.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import mimeTypesConstants from '../../../constant/mimeTypes.constants.js';
import fileExtensionsConstants from '../../../constant/fileExtensions.constants.js';
import translatorsConstant from './translators.constant.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';
import AdminActivityLoggerModel from '../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants from '../admin/adminActivityLogger/adminActivityLogger.constants.js';
import configuration from '../../../configuration/configuration.js';

import isEmptyObject from '../../../utilities/isEmptyObject.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import validateFile from '../../../utilities/validateFile.js';
import BooksModel from '../books/books.model.js';

/**
 * Populates translator fields with additional information.
 *
 * @async
 * @function
 * @name populateTranslatorFields
 * @param {mongoose.Query} query - The Mongoose query to populate fields.
 * @returns {Promise<mongoose.Document>} - The populated document.
 */
const populateTranslatorFields = async (query) => {
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

const translatorListParamsMapping = {};

/**
 * Creates a new translator.
 *
 * @async
 * @function
 * @name createTranslator
 * @param {Object} requester - The user requesting the creation.
 * @param {Object} translatorData - The data for the new translator.
 * @param {Object} translatorImage - The image file for the translator.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the created translator.
 */
const createTranslator = async (requester, translatorData, translatorImage) => {
    try {
        const exists = await TranslatorsModel.exists({ name: translatorData.name });
        if (exists) {
            return sendResponse(
                {},
                `Translators name "${translatorData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        // if (!translatorImage) {
        //     return errorResponse(
        //         'Please provide an image.',
        //         httpStatus.BAD_REQUEST
        //     );
        // }

        let translatorImageData;
        if (translatorImage) {
            const fileValidationResults = validateFile(
                translatorImage,
                translatorsConstant.imageSize,
                [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
                [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
            );
            if (!fileValidationResults.isValid) {
                return errorResponse(
                    fileValidationResults.message,
                    httpStatus.BAD_REQUEST
                );
            }

            const file = translatorImage;
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                {
                    folder: 'library-management-system-server',
                    public_id: file.originalname,
                }
            );

            // Update image data in update object
            translatorImageData = {
                fileId: result?.asset_id,
                shareableLink: result?.secure_url,
                downloadLink: result.url,
            };
        }

        translatorData.createdBy = requester;

        const newTranslator = await TranslatorsModel.create({
            ...translatorData,
            image: translatorImageData,
        });

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${translatorData.name} created successfully.`,
            details: JSON.stringify(newTranslator),
        });

        return sendResponse(
            newTranslator,
            'Translator created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create translator: ${error}`);

        return errorResponse(
            error.message || 'Failed to create translator.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves a list of translators.
 *
 * @async
 * @function
 * @name getTranslators
 * @param {Object} params - The query parameters for retrieving translators.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the list of translators.
 */
const getTranslators = async (params) => {
    try {
        // Aggregation pipeline to fetch translators with their book counts and populate createdBy and updatedBy fields
        const translatorsWithBookCounts = await TranslatorsModel.aggregate([
            {
                // Lookup stage to join Books with Translators
                $lookup: {
                    from: 'books', // Name of the books collection
                    localField: '_id', // Translator ID in the Translators collection
                    foreignField: 'translator', // Reference field in the Books collection
                    as: 'books', // Output array name
                },
            },
            {
                // Lookup stage to populate the createdBy field from the Users collection
                $lookup: {
                    from: 'admins', // Name of the users (or admin) collection
                    localField: 'createdBy', // Field in the Translators collection
                    foreignField: '_id', // Matching field in the Users collection
                    as: 'createdBy', // Output array name
                },
            },
            {
                // Lookup stage to populate the updatedBy field from the Users collection
                $lookup: {
                    from: 'admins', // Name of the users (or admin) collection
                    localField: 'updatedBy', // Field in the Translators collection
                    foreignField: '_id', // Matching field in the Users collection
                    as: 'updatedBy', // Output array name
                },
            },
            {
                // Unwind createdBy and updatedBy fields to convert them from arrays to objects
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true, // Keeps the translator even if createdBy is null
                },
            },
            {
                $unwind: {
                    path: '$updatedBy',
                    preserveNullAndEmptyArrays: true, // Keeps the translator even if updatedBy is null
                },
            },
            {
                // Project stage to format the output, include fields, and count the number of books
                $project: {
                    _id: 1,
                    name: 1,
                    review: 1,
                    summary: 1,
                    isActive: 1,
                    createdBy: {
                        _id: 1,
                        name: 1, // Adjust fields based on your user schema
                        email: 1,
                    },
                    updatedBy: {
                        _id: 1,
                        name: 1, // Adjust fields based on your user schema
                        email: 1,
                    },
                    bookCount: { $size: '$books' }, // Count the number of books
                },
            },
            {
                // Add a facet to get both the items and the total count
                $facet: {
                    items: [{ $match: {} }], // Retrieve all items with previous stages
                    total: [{ $count: 'total' }], // Count total translators
                },
            },
        ]);

        // Extract items and total count from the aggregated result
        const items = translatorsWithBookCounts[0]?.items || [];
        const total = translatorsWithBookCounts[0]?.total[0]?.total || 0;

        if (!total) {
            return sendResponse({}, 'No translators found.', httpStatus.OK);
        }

        return sendResponse(
            {
                items,
                total, // Add the total translators count to the response
            },
            'Translators fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to fetch translators: ${error}`);

        return errorResponse(
            error.message || 'Failed to fetch translators.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Retrieves details of a specific translator by ID.
 *
 * @async
 * @function
 * @name getTranslator
 * @param {string} translatorId - The ID of the translator to be retrieved.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the translator details.
 */
const getTranslator = async (translatorId) => {
    try {
        const translatorsWithBookCounts = await TranslatorsModel.aggregate([
            {
                $lookup: {
                    from: BooksModel.collection.name, // Make sure this is the correct collection name
                    localField: '_id',
                    foreignField: 'translator',
                    as: 'books',
                },
            },
            {
                $unwind: {
                    path: '$books',
                    preserveNullAndEmptyArrays: true, // Keep translators with no books
                },
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    image: { $first: '$image' },
                    summary: { $first: '$summary' },
                    isActive: { $first: '$isActive' },
                    bookCount: { $sum: 1 }, // Sum the occurrences of books
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    summary: 1,
                    isActive: 1,
                    bookCount: {
                        $cond: {
                            if: { $gt: ['$bookCount', 0] },
                            then: { $subtract: ['$bookCount', 1] },
                            else: 0,
                        },
                    }, // Correct for $unwind adding 1 when no books are present
                },
            },
        ]);

        return sendResponse(
            {
                items: translatorsWithBookCounts,
            },
            'Translators fetched successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to fetch translators: ${error}`);

        return errorResponse(
            error.message || 'Failed to fetch subject.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Updates a specific translator by ID.
 *
 * @async
 * @function
 * @name updateTranslator
 * @param {Object} requester - The user requesting the update.
 * @param {string} translatorId - The ID of the translator to be updated.
 * @param {Object} updateData - The data to update the translator with.
 * @param {Object} translatorImage - The new image file for the translator.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the updated translator.
 */
const updateTranslator = async (requester, translatorId, updateData, translatorImage) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        // if (!translatorImage) {
        //     return errorResponse(
        //         'Please provide an image.',
        //         httpStatus.BAD_REQUEST
        //     );
        // }

        if (translatorImage) {
            const fileValidationResults = validateFile(
                translatorImage,
                translatorsConstant.imageSize,
                [mimeTypesConstants.JPG, mimeTypesConstants.PNG],
                [fileExtensionsConstants.JPG, fileExtensionsConstants.PNG]
            );
            if (!fileValidationResults.isValid) {
                return errorResponse(
                    fileValidationResults.message,
                    httpStatus.BAD_REQUEST
                );
            }

            const file = translatorImage;
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                {
                    folder: 'library-management-system-server',
                    public_id: file.originalname,
                }
            );

            // Update image data in update object
            const translatorImageData = {
                fileId: result?.asset_id,
                shareableLink: result?.secure_url,
                downloadLink: result.url,
            };

            if (translatorImageData) {
                updateData.image = translatorImageData;
            }
        }

        updateData.updatedBy = requester;

        const updatedTranslator = await TranslatorsModel.findByIdAndUpdate(
            translatorId,
            updateData,
            {
                new: true,
            }
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${translatorId} updated successfully.`,
            details: JSON.stringify(updatedTranslator),
            affectedId: translatorId,
        });

        return sendResponse(
            updatedTranslator,
            'Translator updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to update translator: ${error}`);

        return errorResponse(
            error.message || 'Failed to update translator.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * Deletes multiple translators by their IDs.
 *
 * @async
 * @function
 * @name deleteTranslators
 * @param {Object} requester - The user requesting the deletion.
 * @param {Array<string>} translatorIds - The IDs of the translators to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to the response object confirming the deletion.
 */
const deleteTranslators = async (requester, translatorIds) => {
    return await service.deleteResourcesByList(
        requester,
        TranslatorsModel,
        translatorIds,
        'translator'
    );
};

/**
 * Deletes a specific translator by ID.
 *
 * @async
 * @function
 * @name deleteTranslator
 * @param {Object} requester - The user requesting the deletion.
 * @param {string} translatorId - The ID of the translator to be deleted.
 * @returns {Promise<Object>} - A promise that resolves to the response object confirming the deletion.
 */
const deleteTranslator = async (requester, translatorId) => {
    return service.deleteResourceById(
        requester,
        TranslatorsModel,
        translatorId,
        'translator'
    );
};

const translatorsService = {
    createTranslator,
    getTranslators,
    getTranslator,
    updateTranslator,
    deleteTranslators,
    deleteTranslator,
};

export default translatorsService;
