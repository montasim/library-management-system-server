/**
 * @fileoverview This file defines and exports the controller for books history-related operations.
 * The controller functions handle incoming requests for retrieving the history of books and
 * individual book history, utilizing the respective services and routes constants.
 */

import booksHistoryService from './booksHistory.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

/**
 * booksHistoryController - An object that holds the controller functions for books history-related operations.
 * These functions handle the requests for retrieving books history and individual book history.
 *
 * @typedef {Object} BooksHistoryController
 * @property {Function} getBooksHistory - Controller function to retrieve the history of books.
 * @property {Function} getBookHistory - Controller function to retrieve the history of an individual book.
 */
const booksHistoryController = {
    /**
     * getBooksHistory - Controller function to retrieve the history of books.
     * Utilizes the booksHistoryService to get a list of books history.
     *
     * @function
     */
    getBooksHistory: controller.getList(
        booksHistoryService,
        'getBooksHistory'
    ),

    /**
     * getBookHistory - Controller function to retrieve the history of an individual book.
     * Utilizes the booksHistoryService to get the history of a specific book by its ID.
     *
     * @function
     */
    getBookHistory: controller.getById(
        booksHistoryService,
        'getBooksHistory',
        routesConstants.booksHistory.params
    ),
};

export default booksHistoryController;
