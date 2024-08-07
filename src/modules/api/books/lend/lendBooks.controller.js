/**
 * @fileoverview This file defines and exports the controller for the lend books module.
 * The controller includes methods for creating a new lend book record and retrieving a list of lend book records.
 * These methods utilize the shared controller functions to handle the core logic.
 */

import lendBooksService from './lendBooks.service.js';
import controller from '../../../../shared/controller.js';

/**
 * lendBooksController - Controller for handling lend books operations.
 * Includes methods for creating a new lend book record and retrieving a list of lend book records.
 *
 * @typedef {Object} LendBooksController
 * @property {Function} createLendBook - Controller method for creating a new lend book record.
 * @property {Function} getLendBooks - Controller method for retrieving a list of lend book records.
 */
const lendBooksController = {
    /**
     * createLendBook - Controller method for creating a new lend book record.
     * Utilizes the shared controller's create method with the lendBooksService.
     *
     * @function
     */
    createLendBook: controller.create(lendBooksService, 'createLendBook'),

    /**
     * getLendBooks - Controller method for retrieving a list of lend book records.
     * Utilizes the shared controller's getList method with the lendBooksService.
     *
     * @function
     */
    getLendBooks: controller.getList(lendBooksService, 'getLendBooks'),
};

export default lendBooksController;
