/**
 * @fileoverview This file defines the service functions for managing publications. These services include
 * functions for creating, retrieving, updating, and deleting publications. The services interact with the
 * Publications model and utilize various utilities for logging, response handling, and validation.
 * Additionally, functions for populating related fields and managing publications lists are provided.
 */

import PublicationsModel from './publications.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';
import AdminActivityLoggerModel from '../admin/adminActivityLogger/adminActivityLogger.model.js';
import adminActivityLoggerConstants from '../admin/adminActivityLogger/adminActivityLogger.constants.js';

/**
 * populatePublicationFields - A helper function to populate related fields in the publication documents.
 *
 * @param {Object} query - The Mongoose query object.
 * @returns {Promise<Object>} - The query result with populated fields.
 */
const populatePublicationFields = async (query) => {
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

const pronounsListParamsMapping = {};

/**
 * createPublication - Service function to create a new publication. This function checks for the existence
 * of a publication with the same name, creates the publication if it doesn't exist, and logs the creation action.
 *
 * @param {Object} requester - The user creating the publication.
 * @param {Object} newPublicationData - The data for the new publication.
 * @returns {Promise<Object>} - The created publication or an error response.
 */
const createPublication = async (requester, newPublicationData) => {
    try {
        const exists = await PublicationsModel.exists({
            name: newPublicationData.name,
        });
        if (exists) {
            return sendResponse(
                {},
                `Publication name "${newPublicationData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        newPublicationData.createdBy = requester;

        const newPublication =
            await PublicationsModel.create(newPublicationData);
        // Populate the necessary fields after creation
        const populatedPublication = await populatePublicationFields(
            PublicationsModel.findById(newPublication._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newPublicationData.name} created successfully.`,
            details: JSON.stringify(populatedPublication),
        });

        return sendResponse(
            populatedPublication,
            'Publication created successfully.',
            httpStatus.CREATED
        );
    } catch (error) {
        loggerService.error(`Failed to create publication: ${error}`);

        return errorResponse(
            error.message || 'Failed to create publication.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * getPublicationList - Service function to retrieve a list of publications based on provided parameters.
 * This function utilizes a shared service to handle the retrieval and mapping of parameters.
 *
 * @param {Object} params - The query parameters for retrieving the publications list.
 * @returns {Promise<Object>} - The retrieved list of publications.
 */
const getPublicationList = async (params) => {
    return service.getResourceList(
        PublicationsModel,
        populatePublicationFields,
        params,
        pronounsListParamsMapping,
        'publication'
    );
};

/**
 * getPublicationById - Service function to retrieve a publication by its ID. This function utilizes a shared
 * service to handle the retrieval and population of related fields.
 *
 * @param {String} publicationId - The ID of the publication to retrieve.
 * @returns {Promise<Object>} - The retrieved publication or an error response.
 */
const getPublicationById = async (publicationId) => {
    return service.getResourceById(
        PublicationsModel,
        populatePublicationFields,
        publicationId,
        'publication'
    );
};

/**
 * updatePublicationById - Service function to update a publication by its ID. This function checks for the
 * existence of the publication, updates it with the provided data, and logs the update action.
 *
 * @param {Object} requester - The user updating the publication.
 * @param {String} publicationId - The ID of the publication to update.
 * @param {Object} updateData - The data to update the publication with.
 * @returns {Promise<Object>} - The updated publication or an error response.
 */
const updatePublicationById = async (requester, publicationId, updateData) => {
    try {
        if (isEmptyObject(updateData)) {
            return errorResponse(
                'Please provide update data.',
                httpStatus.BAD_REQUEST
            );
        }

        updateData.updatedBy = requester;

        // Attempt to update the publication
        const updatedPublication = await PublicationsModel.findByIdAndUpdate(
            publicationId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPublication) {
            return sendResponse(
                {},
                'Publication not found.',
                httpStatus.NOT_FOUND
            );
        }

        // Optionally populate if necessary (could be omitted based on requirements)
        const populatedPublication = await populatePublicationFields(
            PublicationsModel.findById(updatedPublication._id)
        );

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${publicationId} updated successfully.`,
            details: JSON.stringify(populatedPublication),
            affectedId: publicationId,
        });

        return sendResponse(
            populatedPublication,
            'Publication updated successfully.',
            httpStatus.OK
        );
    } catch (error) {
        // Handle specific errors, like duplicate names, here
        if (error.code === 11000) {
            // MongoDB duplicate key error
            return sendResponse(
                {},
                `Publication name "${updateData.name}" already exists.`,
                httpStatus.BAD_REQUEST
            );
        }

        loggerService.error(`Failed to update publication: ${error}`);

        return errorResponse(
            error.message || 'Failed to update publication.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * deletePublicationList - Service function to delete a list of publications by their IDs. This function
 * utilizes a shared service to handle the deletion process.
 *
 * @param {Object} requester - The user deleting the publications.
 * @param {Array<String>} publicationIds - The IDs of the publications to delete.
 * @returns {Promise<Object>} - The result of the deletion process.
 */
const deletePublicationList = async (requester, publicationIds) => {
    return await service.deleteResourcesByList(
        requester,
        PublicationsModel,
        publicationIds,
        'publication'
    );
};

/**
 * deletePublicationById - Service function to delete a publication by its ID. This function utilizes a
 * shared service to handle the deletion process.
 *
 * @param {Object} requester - The user deleting the publication.
 * @param {String} publicationId - The ID of the publication to delete.
 * @returns {Promise<Object>} - The result of the deletion process.
 */
const deletePublicationById = async (requester, publicationId) => {
    return service.deleteResourceById(
        requester,
        PublicationsModel,
        publicationId,
        'publication'
    );
};

/**
 * publicationsService - Object containing all the defined service functions for publications management:
 *
 * - createPublication: Service function to create a new publication.
 * - getPublicationList: Service function to retrieve a list of publications based on provided parameters.
 * - getPublicationById: Service function to retrieve a publication by its ID.
 * - updatePublicationById: Service function to update a publication by its ID.
 * - deletePublicationList: Service function to delete a list of publications by their IDs.
 * - deletePublicationById: Service function to delete a publication by its ID.
 */
const publicationsService = {
    createPublication,
    getPublicationList,
    getPublicationById,
    updatePublicationById,
    deletePublicationById,
    deletePublicationList,
};

export default publicationsService;
