/**
 * @fileoverview This module defines the controller for handling operations related to writers.
 * It leverages the shared controller utilities to create, retrieve, update, and delete writer records.
 *
 * The `writersController` object includes methods to:
 * - Create a new writer.
 * - Retrieve a list of writers.
 * - Retrieve details of a specific writer by ID.
 * - Update a specific writer by ID.
 * - Delete a specific writer by ID.
 * - Delete multiple writers.
 */

import writersService from './writers.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

const writersController = {
    /**
     * Creates a new writer.
     *
     * This function uses the `create` method from the shared controller utilities
     * to add a new writer record. It delegates the actual service logic to the `writersService` and specifies the `createWriter` method.
     *
     * @function
     * @name writersController.createWriter
     * @param {Object} request - The request object containing the details of the writer to be created.
     * @param {Object} response - The response object used to send back the appropriate HTTP response.
     *
     * @returns {Promise<void>} - A promise that resolves when the writer is successfully created.
     */
    createWriter: controller.create(writersService, 'createWriter'),

    /**
     * Retrieves a list of writers.
     *
     * This function uses the `getList` method from the shared controller utilities
     * to fetch a list of writer records. It delegates the actual service logic to the `writersService` and specifies the `getWriters` method.
     *
     * @function
     * @name writersController.getWriters
     * @param {Object} request - The request object containing any query parameters for filtering the list.
     * @param {Object} response - The response object used to send back the list of writers.
     *
     * @returns {Promise<void>} - A promise that resolves with the list of writers.
     */
    getWriters: controller.getList(writersService, 'getWriters'),

    /**
     * Retrieves details of a specific writer by ID.
     *
     * This function uses the `getById` method from the shared controller utilities
     * to fetch the details of a writer by their ID. It delegates the actual service logic to the `writersService` and specifies the `getWriter` method.
     *
     * @function
     * @name writersController.getWriter
     * @param {Object} request - The request object containing the writer ID as a parameter.
     * @param {Object} response - The response object used to send back the writer's details.
     *
     * @returns {Promise<void>} - A promise that resolves with the details of the specified writer.
     */
    getWriter: controller.getById(
        writersService,
        'getWriter',
        routesConstants.writers.params
    ),

    /**
     * Updates a specific writer by ID.
     *
     * This function uses the `updateById` method from the shared controller utilities
     * to update the details of a writer by their ID. It delegates the actual service logic to the `writersService` and specifies the `updateWriter` method.
     *
     * @function
     * @name writersController.updateWriter
     * @param {Object} request - The request object containing the writer ID as a parameter and the updated details in the body.
     * @param {Object} response - The response object used to send back the updated writer's details.
     *
     * @returns {Promise<void>} - A promise that resolves with the updated details of the specified writer.
     */
    updateWriter: controller.updateById(
        writersService,
        'updateWriter',
        routesConstants.writers.params
    ),

    /**
     * Deletes a specific writer by ID.
     *
     * This function uses the `deleteById` method from the shared controller utilities
     * to delete a writer by their ID. It delegates the actual service logic to the `writersService` and specifies the `deleteWriter` method.
     *
     * @function
     * @name writersController.deleteWriter
     * @param {Object} request - The request object containing the writer ID as a parameter.
     * @param {Object} response - The response object used to send back the confirmation of the writer's deletion.
     *
     * @returns {Promise<void>} - A promise that resolves with the confirmation of the writer's deletion.
     */
    deleteWriter: controller.deleteById(
        writersService,
        'deleteWriter',
        routesConstants.writers.params
    ),

    /**
     * Deletes multiple writers.
     *
     * This function uses the `deleteList` method from the shared controller utilities
     * to delete multiple writer records. It delegates the actual service logic to the `writersService` and specifies the `deleteWriters` method.
     *
     * @function
     * @name writersController.deleteWriters
     * @param {Object} request - The request object containing the details of the writers to be deleted.
     * @param {Object} response - The response object used to send back the confirmation of the writers' deletion.
     *
     * @returns {Promise<void>} - A promise that resolves with the confirmation of the writers' deletion.
     */
    deleteWriters: controller.deleteList(writersService, 'deleteWriters'),
};

export default writersController;
