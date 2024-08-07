/**
 * @fileoverview This file defines and exports the controller for handling request books operations.
 * The controller includes methods for creating a new requested book, retrieving a list of requested books,
 * fetching a requested book by its book ID, fetching requested books by owner ID, and deleting a requested book.
 * The methods utilize the requestBooksService for performing the operations and the controller helper for standardized responses.
 */

import requestBooksService from './requestBooks.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const requestBooksController = {
    /**
     * createRequestBook - Controller method to create a new requested book.
     * Utilizes the create method from the controller helper and requestBooksService.
     */
    createRequestBook: controller.create(
        requestBooksService,
        'createRequestBook'
    ),

    /**
     * getRequestBooks - Controller method to retrieve a list of requested books.
     * Utilizes the getList method from the controller helper and requestBooksService.
     */
    getRequestBooks: controller.getList(
        requestBooksService,
        'getRequestBooks'
    ),

    /**
     * getRequestBookByBookId - Controller method to fetch a requested book by its book ID.
     * Utilizes the getById method from the controller helper and requestBooksService.
     *
     * @param {string} bookId - The ID of the book to retrieve.
     */
    getRequestBookByBookId: controller.getById(
        requestBooksService,
        'getRequestBook',
        routesConstants.requestBooks.params
    ),

    /**
     * getRequestedBooksByOwnerId - Controller method to fetch requested books by the owner's ID.
     * Utilizes the getById method from the controller helper and requestBooksService.
     *
     * @param {string} ownerId - The ID of the owner to retrieve requested books for.
     */
    getRequestedBooksByOwnerId: controller.getById(
        requestBooksService,
        'getRequestedBooksByOwnerId',
        'ownerId'
    ),
    /**
     * deleteRequestBook - Controller method to delete a requested book.
     * Utilizes the deleteById method from the controller helper and requestBooksService.
     *
     * @param {string} bookId - The ID of the book to delete.
     */

    deleteRequestBook: controller.deleteById(
        requestBooksService,
        'deleteRequestBook',
        routesConstants.requestBooks.params
    ),
};

export default requestBooksController;
