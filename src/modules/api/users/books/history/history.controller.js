/**
 * @fileoverview
 * This module defines the controller for handling operations related to a user's book history.
 * It leverages the shared controller utilities to fetch and manage records of books a user has interacted with.
 *
 * The `historyController` object includes methods to:
 * - Retrieve the book history for the requesting user.
 * - Retrieve the book history for a specific book identified by its ID.
 */

import historyService from './history.service.js';
import controller from '../../../../../shared/controller.js';

const historyController = {
    /**
     * Retrieves the book history for the requesting user.
     *
     * This function uses the `getByRequester` method from the shared controller utilities
     * to fetch the book history for the authenticated requester.
     * It delegates the actual service logic to the `historyService` and specifies the `getBooksHistory` method.
     *
     * @function
     * @name historyController.getBooksHistory
     * @param {Object} request - The request object containing the requester's details.
     * @param {Object} response - The response object used to send back the book history.
     *
     * @returns {Promise<void>} - A promise that resolves with the book history for the requester.
     */
    getBooksHistory: controller.getByRequester(
        historyService,
        'getBooksHistory'
    ),

    /**
     * Retrieves the book history for a specific book identified by its ID.
     *
     * This function uses the `getById` method from the shared controller utilities
     * to fetch the book history for a specific book based on the provided book ID.
     * It delegates the actual service logic to the `historyService` and specifies the `getBookHistoryByBookId` method.
     *
     * @function
     * @name historyController.getBookHistoryByBookId
     * @param {Object} request - The request object containing the book ID.
     * @param {Object} response - The response object used to send back the book history for the specified book ID.
     *
     * @returns {Promise<void>} - A promise that resolves with the book history for the specified book ID.
     */
    getBookHistoryByBookId: controller.getById(
        historyService,
        'getBookHistoryByBookId',
        'bookId'
    ),
};

export default historyController;
