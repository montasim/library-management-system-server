/**
 * @fileoverview This file defines the service functions for managing subjects. These services include
 * functions for creating, retrieving, updating, and deleting subjects. The services interact with the
 * Subjects model and utilize various utilities for logging, response handling, and validation.
 * Additionally, functions for populating related fields and managing subjects lists are provided.
 */

import SubjectsModel from './subjects.model.js';
import httpStatus from '../../../constant/httpStatus.constants.js';
import loggerService from '../../../service/logger.service.js';
import service from '../../../shared/service.js';
import adminActivityLoggerConstants from '../admin/adminActivityLogger/adminActivityLogger.constants.js';
import AdminActivityLoggerModel from '../admin/adminActivityLogger/adminActivityLogger.model.js';
import BooksModel from '../books/books.model.js';

import errorResponse from '../../../utilities/errorResponse.js';
import sendResponse from '../../../utilities/sendResponse.js';
import isEmptyObject from '../../../utilities/isEmptyObject.js';

/**
 * populateSubjectFields - A helper function to populate related fields in the subject documents.
 *
 * @param {Object} query - The Mongoose query object.
 * @returns {Promise<Object>} - The query result with populated fields.
 */
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

const subjectListParamsMapping = {};

/**
 * createSubject - Service function to create a new subject. This function validates the provided data,
 * sets the createdBy field, and creates the subject. It also logs the creation action and populates the
 * necessary fields upon creation.
 *
 * @param {Object} requester - The user creating the subject.
 * @param {Object} newSubjectData - The data for the new subject.
 * @returns {Promise<Object>} - The created subject or an error response.
 */
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

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.CREATE,
            description: `${newSubjectData.name} created successfully.`,
            details: JSON.stringify(populatedSubject),
        });

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

/**
 * getSubjects - Service function to retrieve a list of subjects based on provided parameters.
 * This function builds the query, fetches the subjects, and returns the paginated result.
 *
 * @param {Object} params - The query parameters for retrieving the subjects list.
 * @returns {Promise<Object>} - The retrieved list of subjects or an error response.
 */
const getSubjects = async (params) => {
    try {
        // Aggregation pipeline to fetch subjects with their book counts and populate createdBy and updatedBy fields
        const subjectsWithBookCounts = await SubjectsModel.aggregate([
            {
                // Lookup stage to join Books with Subjects
                $lookup: {
                    from: 'books', // Name of the books collection
                    localField: '_id', // Subject ID in the Subjects collection
                    foreignField: 'subject', // Reference field in the Books collection
                    as: 'books', // Output array name
                },
            },
            {
                // Lookup stage to populate the createdBy field from the Users collection
                $lookup: {
                    from: 'admins', // Name of the users (or admin) collection
                    localField: 'createdBy', // Field in the Subjects collection
                    foreignField: '_id', // Matching field in the Users collection
                    as: 'createdBy', // Output array name
                },
            },
            {
                // Lookup stage to populate the updatedBy field from the Users collection
                $lookup: {
                    from: 'admins', // Name of the users (or admin) collection
                    localField: 'updatedBy', // Field in the Subjects collection
                    foreignField: '_id', // Matching field in the Users collection
                    as: 'updatedBy', // Output array name
                },
            },
            {
                // Unwind createdBy and updatedBy fields to convert them from arrays to objects
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true, // Keeps the subject even if createdBy is null
                },
            },
            {
                $unwind: {
                    path: '$updatedBy',
                    preserveNullAndEmptyArrays: true, // Keeps the subject even if updatedBy is null
                },
            },
            {
                // Project stage to format the output, include fields, and count the number of books
                $project: {
                    _id: 1,
                    name: 1,
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
                    total: [{ $count: 'total' }], // Count total subjects
                },
            },
        ]);

        // Extract items and total count from the aggregated result
        const items = subjectsWithBookCounts[0]?.items || [];
        const total = subjectsWithBookCounts[0]?.total[0]?.total || 0;

        if (!total) {
            return sendResponse({}, 'No subjects found.', httpStatus.OK);
        }

        return sendResponse(
            {
                items,
                total, // Add the total subjects count to the response
            },
            'Subjects fetched successfully.',
            httpStatus.OK
        );
    } catch (error) {
        loggerService.error(`Failed to fetch subjects: ${error}`);

        return errorResponse(
            error.message || 'Failed to fetch subjects.',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};

/**
 * getSubjectById - Service function to retrieve a subject by its ID. This function fetches the subject,
 * populates the necessary fields, and returns the subject.
 *
 * @param {String} subjectId - The ID of the subject to retrieve.
 * @returns {Promise<Object>} - The retrieved subject or an error response.
 */
const getSubjectById = async (subjectId) => {
    return service.getResourceById(
        SubjectsModel,
        populateSubjectFields,
        subjectId,
        'subject'
    );
};

/**
 * updateSubject - Service function to update a subject by its ID. This function validates the update data,
 * sets the updatedBy field, updates the subject, logs the action, and returns the updated subject.
 *
 * @param {Object} requester - The user updating the subject.
 * @param {String} subjectId - The ID of the subject to update.
 * @param {Object} updateData - The data to update the subject with.
 * @returns {Promise<Object>} - The updated subject or an error response.
 */
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

        await AdminActivityLoggerModel.create({
            user: requester,
            action: adminActivityLoggerConstants.actionTypes.UPDATE,
            description: `${subjectId} updated successfully.`,
            details: JSON.stringify(populatedSubject),
            affectedId: subjectId,
        });

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

/**
 * deleteSubjects - Service function to delete a list of subjects by their IDs. This function utilizes a
 * shared service to handle the deletion process.
 *
 * @param {Object} requester - The user deleting the subjects.
 * @param {Array<String>} subjectIds - The IDs of the subjects to delete.
 * @returns {Promise<Object>} - The result of the deletion process or an error response.
 */
const deleteSubjects = async (requester, subjectIds) => {
    return await service.deleteResourcesByList(
        requester,
        SubjectsModel,
        subjectIds,
        'subject'
    );
};

/**
 * deleteSubject - Service function to delete a subject by its ID. This function utilizes a shared service
 * to handle the deletion process.
 *
 * @param {Object} requester - The user deleting the subject.
 * @param {String} subjectId - The ID of the subject to delete.
 * @returns {Promise<Object>} - The result of the deletion process or an error response.
 */
const deleteSubject = async (requester, subjectId) => {
    return service.deleteResourceById(
        requester,
        SubjectsModel,
        subjectId,
        'subject'
    );
};

/**
 * subjectsService - Object containing all the defined service functions for subjects management:
 *
 * - createSubject: Service function to create a new subject.
 * - getSubjects: Service function to retrieve a list of subjects based on provided parameters.
 * - getSubjectById: Service function to retrieve a subject by its ID.
 * - updateSubject: Service function to update a subject by its ID.
 * - deleteSubjects: Service function to delete a list of subjects by their IDs.
 * - deleteSubject: Service function to delete a subject by its ID.
 */
const subjectsService = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsService;
