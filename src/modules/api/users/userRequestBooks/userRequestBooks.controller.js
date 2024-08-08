/**
 * @fileoverview This module defines the controller for handling operations related to user-requested books.
 * It leverages the shared controller utilities to create, retrieve, and delete records of books requested by users.
 *
 * The `userRequestBooksController` object includes methods to:
 * - Retrieve the list of requested books for the requesting user.
 * - Retrieve details of a specific requested book.
 * - Delete a specific requested book.
 */

import requestBooksService from './userRequestBooks.service.js';
import controller from '../../../../shared/controller.js';

const userRequestBooksController = {
    /**
     * Retrieves the list of requested books for the requesting user.
     *
     * This function uses the `getByRequester` method from the shared controller utilities
     * to fetch the list of books requested by the authenticated requester.
     * It delegates the actual service logic to the `requestBooksService` and specifies the `getRequestBooks` method.
     *
     * @function
     * @name userRequestBooksController.getRequestBooks
     * @param {Object} request - The request object containing the requester's details.
     * @param {Object} response - The response object used to send back the list of requested books.
     *
     * @returns {Promise<void>} - A promise that resolves with the list of requested books for the requester.
     */
    getRequestBooks: controller.getByRequester(
        requestBooksService,
        'getRequestBooks'
    ),

    /**
     * Retrieves details of a specific requested book identified by its ID.
     *
     * This function uses the `getById` method from the shared controller utilities
     * to fetch the details of a specific requested book based on the provided book ID.
     * It delegates the actual service logic to the `requestBooksService` and specifies the `getRequestBook` method.
     *
     * @function
     * @name userRequestBooksController.getRequestBook
     * @param {Object} request - The request object containing the book ID.
     * @param {Object} response - The response object used to send back the details of the requested book.
     *
     * @returns {Promise<void>} - A promise that resolves with the details of the requested book.
     */
    getRequestBook: controller.getById(
        requestBooksService,
        'getRequestBook',
        'requestedBookId'
    ),

    /**
     * Deletes a specific requested book identified by its ID.
     *
     * This function uses the `deleteById` method from the shared controller utilities
     * to delete a specific requested book based on the provided book ID.
     * It delegates the actual service logic to the `requestBooksService` and specifies the `deleteRequestBook` method.
     *
     * @function
     * @name userRequestBooksController.deleteRequestBook
     * @param {Object} request - The request object containing the book ID.
     * @param {Object} response - The response object used to send back the confirmation of the deletion.
     *
     * @returns {Promise<void>} - A promise that resolves with the confirmation of the deletion.
     */
    deleteRequestBook: controller.deleteById(
        requestBooksService,
        'deleteRequestBook',
        'requestedBookId'
    ),
};

export default userRequestBooksController;
