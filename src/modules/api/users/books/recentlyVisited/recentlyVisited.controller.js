/**
 * @fileoverview
 * This module defines the controller for handling operations related to recently visited books.
 * It leverages the shared controller utilities to create and retrieve records of recently visited books.
 *
 * The `recentlyVisitedController` object includes methods to:
 * - Add a recently visited book to the user's list.
 * - Retrieve the list of recently visited books for the requester.
 */

import recentlyVisitedService from './recentlyVisited.service.js';
import controller from '../../../../../shared/controller.js';

const recentlyVisitedController = {
    /**
     * Adds a recently visited book to the user's list.
     *
     * This function utilizes the `create` method from the shared controller utilities
     * to add a new record of a recently visited book to the user's list.
     * It delegates the actual service logic to the `recentlyVisitedService` and specifies the `add` method.
     *
     * @function
     * @name recentlyVisitedController.add
     * @param {Object} request - The request object containing the details of the book to be added.
     * @param {Object} response - The response object used to send back the appropriate HTTP response.
     *
     * @returns {Promise<void>} - A promise that resolves when the book is successfully added to the list.
     */
    add: controller.create(recentlyVisitedService, 'add'),

    /**
     * Retrieves the list of recently visited books for the requester.
     *
     * This function uses the `getByRequester` method from the shared controller utilities
     * to fetch the list of recently visited books for the authenticated requester.
     * It delegates the actual service logic to the `recentlyVisitedService` and specifies the `get` method.
     *
     * @function
     * @name recentlyVisitedController.get
     * @param {Object} request - The request object containing the requester's details.
     * @param {Object} response - The response object used to send back the list of recently visited books.
     *
     * @returns {Promise<void>} - A promise that resolves with the list of recently visited books for the requester.
     */
    get: controller.getByRequester(recentlyVisitedService, 'get'),
};

export default recentlyVisitedController;
