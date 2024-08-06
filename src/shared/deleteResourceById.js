/**
 * @fileoverview This module provides a utility function to delete a resource by its ID from a MongoDB collection.
 * It utilizes Mongoose for database operations and integrates with custom response and string utilities to provide
 * standardized feedback messages. The function handles the deletion process, checks for resource existence, and returns
 * appropriate HTTP status codes and messages based on the outcome.
 *
 * The primary functionalities include:
 * - `deleteResourceById`: Asynchronously deletes a resource from a MongoDB collection by its ID.
 *   - If the resource is found and deleted, it returns a success message with HTTP status 200 (OK).
 *   - If the resource is not found, it returns a not found message with HTTP status 404 (Not Found).
 *
 * This function is designed to be reusable across different parts of an application, allowing consistent handling of
 * resource deletion operations. It ensures that responses are standardized and user-friendly, promoting better API
 * usability and error handling.
 */

import httpStatus from '../constant/httpStatus.constants.js';
import sendResponse from '../utilities/sendResponse.js';
import toSentenceCase from '../utilities/toSentenceCase.js';

/**
 * Asynchronously deletes a resource from a MongoDB collection by its ID.
 * Utilizes Mongoose for database operations and integrates with custom response and string utilities.
 * The function handles the deletion process, checks for resource existence, and returns appropriate HTTP status codes and messages based on the outcome.
 *
 * @async
 * @function deleteResourceById
 * @param {Object} requester - The user or controller requesting the deletion.
 * @param {string} resourceId - The ID of the resource to be deleted.
 * @param {mongoose.Model} model - The Mongoose model representing the collection from which the resource should be deleted.
 * @param {string} resourceType - A string representing the type of the resource, used in the response messages.
 * @returns {Promise<Object>} A promise that resolves to an object containing the HTTP response and message.
 * @example
 * import deleteResourceById from './path/to/deleteResourceById.js';
 *
 * const result = await deleteResourceById(req.user, '507f1f77bcf86cd799439011', UserModel, 'user');
 * console.log(result);
 */
const deleteResourceById = async (
    requester,
    resourceId,
    model,
    resourceType
) => {
    const deletedResource = await model.findByIdAndDelete(resourceId);
    if (!deletedResource) {
        return sendResponse(
            {},
            `${toSentenceCase(resourceType)} not found.`,
            httpStatus.NOT_FOUND
        );
    }

    return sendResponse(
        {},
        `${toSentenceCase(resourceType)} deleted successfully.`,
        httpStatus.OK
    );
};

export default deleteResourceById;
