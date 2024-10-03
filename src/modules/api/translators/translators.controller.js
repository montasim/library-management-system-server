/**
 * @fileoverview This module defines the controller for handling operations related to translators.
 * It leverages the shared controller utilities to create, retrieve, update, and delete translator records.
 *
 * The `translatorsController` object includes methods to:
 * - Create a new translator.
 * - Retrieve a list of translators.
 * - Retrieve details of a specific translator by ID.
 * - Update a specific translator by ID.
 * - Delete a specific translator by ID.
 * - Delete multiple translators.
 */

import translatorsService from './translators.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

const translatorsController = {
    /**
     * Creates a new translator.
     *
     * This function uses the `create` method from the shared controller utilities
     * to add a new translator record. It delegates the actual service logic to the `translatorsService` and specifies the `createTranslator` method.
     *
     * @function
     * @name translatorsController.createTranslator
     * @param {Object} request - The request object containing the details of the translator to be created.
     * @param {Object} response - The response object used to send back the appropriate HTTP response.
     *
     * @returns {Promise<void>} - A promise that resolves when the translator is successfully created.
     */
    createTranslator: controller.create(translatorsService, 'createTranslator'),

    /**
     * Retrieves a list of translators.
     *
     * This function uses the `getList` method from the shared controller utilities
     * to fetch a list of translator records. It delegates the actual service logic to the `translatorsService` and specifies the `getTranslators` method.
     *
     * @function
     * @name translatorsController.getTranslators
     * @param {Object} request - The request object containing any query parameters for filtering the list.
     * @param {Object} response - The response object used to send back the list of translators.
     *
     * @returns {Promise<void>} - A promise that resolves with the list of translators.
     */
    getTranslators: controller.getList(translatorsService, 'getTranslators'),

    /**
     * Retrieves details of a specific translator by ID.
     *
     * This function uses the `getById` method from the shared controller utilities
     * to fetch the details of a translator by their ID. It delegates the actual service logic to the `translatorsService` and specifies the `getTranslator` method.
     *
     * @function
     * @name translatorsController.getTranslator
     * @param {Object} request - The request object containing the translator ID as a parameter.
     * @param {Object} response - The response object used to send back the translator's details.
     *
     * @returns {Promise<void>} - A promise that resolves with the details of the specified translator.
     */
    getTranslator: controller.getById(
        translatorsService,
        'getTranslator',
        routesConstants.translators.params
    ),

    /**
     * Updates a specific translator by ID.
     *
     * This function uses the `updateById` method from the shared controller utilities
     * to update the details of a translator by their ID. It delegates the actual service logic to the `translatorsService` and specifies the `updateTranslator` method.
     *
     * @function
     * @name translatorsController.updateTranslator
     * @param {Object} request - The request object containing the translator ID as a parameter and the updated details in the body.
     * @param {Object} response - The response object used to send back the updated translator's details.
     *
     * @returns {Promise<void>} - A promise that resolves with the updated details of the specified translator.
     */
    updateTranslator: controller.updateById(
        translatorsService,
        'updateTranslator',
        routesConstants.translators.params
    ),

    /**
     * Deletes a specific translator by ID.
     *
     * This function uses the `deleteById` method from the shared controller utilities
     * to delete a translator by their ID. It delegates the actual service logic to the `translatorsService` and specifies the `deleteTranslator` method.
     *
     * @function
     * @name translatorsController.deleteTranslator
     * @param {Object} request - The request object containing the translator ID as a parameter.
     * @param {Object} response - The response object used to send back the confirmation of the translator's deletion.
     *
     * @returns {Promise<void>} - A promise that resolves with the confirmation of the translator's deletion.
     */
    deleteTranslator: controller.deleteById(
        translatorsService,
        'deleteTranslator',
        routesConstants.translators.params
    ),

    /**
     * Deletes multiple translators.
     *
     * This function uses the `deleteList` method from the shared controller utilities
     * to delete multiple translator records. It delegates the actual service logic to the `translatorsService` and specifies the `deleteTranslators` method.
     *
     * @function
     * @name translatorsController.deleteTranslators
     * @param {Object} request - The request object containing the details of the translators to be deleted.
     * @param {Object} response - The response object used to send back the confirmation of the translators' deletion.
     *
     * @returns {Promise<void>} - A promise that resolves with the confirmation of the translators' deletion.
     */
    deleteTranslators: controller.deleteList(
        translatorsService,
        'deleteTranslators'
    ),
};

export default translatorsController;
