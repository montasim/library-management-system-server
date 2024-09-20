/**
 * @fileoverview This module defines the controller for handling operations related to user-lent books.
 * It leverages the shared controller utilities to create, retrieve, and delete records of books lent by users.
 *
 * The `lentController` object includes methods to:
 * - Retrieve the list of lent books for the requesting user.
 * - Retrieve details of a specific lent book.
 */

import requestBooksService from './lent.service.js';
import controller from '../../../../../shared/controller.js';

const lentController = {
    /**
     * Retrieves the list of lent books for the requesting user.
     *
     * This function uses the `getByLenter` method from the shared controller utilities
     * to fetch the list of books lent by the authenticated requester.
     * It delegates the actual service logic to the `requestBooksService` and specifies the `getLentBooks` method.
     *
     * @function
     * @name lentController.getLentBooks
     * @param {Object} request - The request object containing the requester's details.
     * @param {Object} response - The response object used to send back the list of lent books.
     *
     * @returns {Promise<void>} - A promise that resolves with the list of lent books for the requester.
     */
    getLentBooks: controller.getByRequester(
        requestBooksService,
        'getLentBooks'
    ),

    /**
     * Retrieves details of a specific lent book identified by its ID.
     *
     * This function uses the `getById` method from the shared controller utilities
     * to fetch the details of a specific lent book based on the provided book ID.
     * It delegates the actual service logic to the `requestBooksService` and specifies the `getLentBook` method.
     *
     * @function
     * @name lentController.getLentBook
     * @param {Object} request - The request object containing the book ID.
     * @param {Object} response - The response object used to send back the details of the lent book.
     *
     * @returns {Promise<void>} - A promise that resolves with the details of the lent book.
     */
    getLentBook: controller.getById(
        requestBooksService,
        'getLentBook',
        'lentBookId'
    ),
};

export default lentController;
