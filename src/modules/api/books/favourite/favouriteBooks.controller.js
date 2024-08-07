/**
 * @fileoverview This file defines and exports the controller for handling favourite books-related operations.
 * The controller includes functions to create a favourite book, retrieve favourite books, and delete a favourite book.
 * The controller functions leverage the favouriteBooksService to perform the necessary business logic and interact with the database.
 */

import favouriteBooksService from './favouriteBooks.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

/**
 * favouriteBooksController - An object that holds the controller functions for favourite books-related operations.
 * Includes functions to create a favourite book, retrieve favourite books, and delete a favourite book.
 *
 * @typedef {Object} FavouriteBooksController
 * @property {Function} createFavouriteBook - Controller function to create a new favourite book for a user.
 * @property {Function} getFavouriteBooks - Controller function to retrieve favourite books for the requesting user.
 * @property {Function} deleteFavouriteBook - Controller function to delete a favourite book by its ID.
 */
const favouriteBooksController = {
    /**
     * createFavouriteBook - Controller function to create a new favourite book for a user.
     * Utilizes the favouriteBooksService to handle the creation logic and routesConstants for parameter configuration.
     *
     * @function
     */
    createFavouriteBook: controller.createWithId(
        favouriteBooksService,
        'createFavouriteBook',
        routesConstants.favouriteBooks.params
    ),

    /**
     * getFavouriteBooks - Controller function to retrieve favourite books for the requesting user.
     * Utilizes the favouriteBooksService to handle the retrieval logic.
     *
     * @function
     */
    getFavouriteBooks: controller.getByRequester(
        favouriteBooksService,
        'getFavouriteBooks'
    ),

    /**
     * deleteFavouriteBook - Controller function to delete a favourite book by its ID.
     * Utilizes the favouriteBooksService to handle the deletion logic and routesConstants for parameter configuration.
     *
     * @function
     */
    deleteFavouriteBook: controller.deleteById(
        favouriteBooksService,
        'deleteFavouriteBook',
        routesConstants.favouriteBooks.params
    ),
};

export default favouriteBooksController;
