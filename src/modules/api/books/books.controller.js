/**
 * @fileoverview This file defines and exports the controller for handling book-related operations.
 * The controller functions handle creating new books, retrieving a list of books, retrieving a book by ID,
 * updating a book by ID, deleting a book by ID, and deleting a list of books. The controller leverages
 * generic functions from a shared controller module and utilizes the booksService for the actual data operations.
 */

import booksService from './books.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

/**
 * booksController - An object that holds controller functions for managing book-related operations.
 * Each function corresponds to a specific CRUD operation and utilizes the booksService for data handling.
 *
 * @typedef {Object} BooksController
 * @property {Function} createNewBook - Controller function for creating a new book.
 * @property {Function} getBookList - Controller function for retrieving a list of books.
 * @property {Function} getBookById - Controller function for retrieving a book by its ID.
 * @property {Function} updateBookById - Controller function for updating a book by its ID.
 * @property {Function} deleteBookById - Controller function for deleting a book by its ID.
 * @property {Function} deleteBookList - Controller function for deleting a list of books.
 */
const booksController = {
    /**
     * createNewBook - Controller function for creating a new book.
     * Delegates the request to the generic create function from the shared controller, which in turn calls the createNewBook method of the booksService.
     */
    createNewBook: controller.create(booksService, 'createNewBook'),

    /**
     * getBookList - Controller function for retrieving a list of books.
     * Delegates the request to the generic getList function from the shared controller, which in turn calls the getBookList method of the booksService.
     */
    getBookList: controller.getList(booksService, 'getBookList'),

    /**
     * getBookById - Controller function for retrieving a book by its ID.
     * Delegates the request to the generic getById function from the shared controller, which in turn calls the getBookById method of the booksService.
     * The ID parameter is defined in the routesConstants configuration.
     */
    getBookById: controller.getById(
        booksService,
        'getBookById',
        routesConstants.books.params
    ),

    /**
     * updateBookById - Controller function for updating a book by its ID.
     * Delegates the request to the generic updateById function from the shared controller, which in turn calls the updateBookById method of the booksService.
     * The ID parameter is defined in the routesConstants configuration.
     */
    updateBookById: controller.updateById(
        booksService,
        'updateBookById',
        routesConstants.books.params
    ),

    /**
     * deleteBookById - Controller function for deleting a book by its ID.
     * Delegates the request to the generic deleteById function from the shared controller, which in turn calls the deleteBookById method of the booksService.
     * The ID parameter is defined in the routesConstants configuration.
     */
    deleteBookById: controller.deleteById(
        booksService,
        'deleteBookById',
        routesConstants.books.params
    ),

    /**
     * deleteBookList - Controller function for deleting a list of books.
     * Delegates the request to the generic deleteList function from the shared controller, which in turn calls the deleteBookList method of the booksService.
     */
    deleteBookList: controller.deleteList(booksService, 'deleteBookList'),
};

export default booksController;
