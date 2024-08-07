/**
 * @fileoverview This file defines and exports the `desiredBooksController` object, which contains
 * methods for handling desired books-related operations. These methods are created by utilizing
 * a shared controller utility and a desired books service. The main method included is for
 * retrieving a list of desired books.
 */

import desiredBooksService from './desiredBooks.service.js';
import controller from '../../../../shared/controller.js';

/**
 * desiredBooksController - An object that holds methods for handling desired books-related operations.
 * These methods utilize a shared controller utility and a desired books service to perform specific actions.
 *
 * @typedef {Object} DesiredBooksController
 * @property {Function} getDesiredBooks - Method to get a list of desired books.
 */
const desiredBooksController = {
    /**
     * getDesiredBooks - Method to get a list of desired books.
     * This method calls the `getList` function from the shared controller with the desired books service and the specific action name.
     *
     * @function
     */
    getDesiredBooks: controller.getList(
        desiredBooksService,
        'getDesiredBooks'
    ),
};

export default desiredBooksController;
