/**
 * @fileoverview This file defines and exports the returnBooksController object, which handles
 * the routing and validation for book return operations. It leverages the shared controller
 * to standardize the handling of service methods for returning books.
 */

import returnBooksService from './returnBooks.service.js';
import controller from '../../../../shared/controller.js';

/**
 * returnBooksController - An object that holds controller methods for book return operations.
 * It utilizes the shared controller to create and manage the return of books.
 *
 * @typedef {Object} ReturnBooksController
 * @property {Function} returnBook - Controller method for returning a book.
 */
const returnBooksController = {
    /**
     * Controller method for returning a book.
     * It uses the shared controller's create method to handle the book return process.
     *
     * @function
     */
    returnBook: controller.create(returnBooksService, 'returnBook'),
};

export default returnBooksController;
