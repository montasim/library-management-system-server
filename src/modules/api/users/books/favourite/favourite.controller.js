/**
 * @fileoverview This file defines and exports the controller for handling favourite books-related operations.
 * The controller includes functions to create a favourite book, retrieve favourite books, and delete a favourite book.
 * The controller functions leverage the favouriteService to perform the necessary business logic and interact with the database.
 */

import favouriteService from './favourite.service.js';
import controller from '../../../../../shared/controller.js';
import routesConstants from '../../../../../constant/routes.constants.js';

/**
 * favouriteController - An object that holds the controller functions for favourite books-related operations.
 * Includes functions to create a favourite book, retrieve favourite books, and delete a favourite book.
 *
 * @typedef {Object} FavouriteController
 * @property {Function} createFavouriteBook - Controller function to create a new favourite book for a user.
 * @property {Function} getFavourite - Controller function to retrieve favourite books for the requesting user.
 * @property {Function} deleteFavouriteBook - Controller function to delete a favourite book by its ID.
 */
const favouriteController = {
    /**
     * getFavourite - Controller function to retrieve favourite books for the requesting user.
     * Utilizes the favouriteService to handle the retrieval logic.
     *
     * @function
     */
    getFavourite: controller.getByRequester(favouriteService, 'getFavourite'),

    /**
     * deleteFavouriteBook - Controller function to delete a favourite book by its ID.
     * Utilizes the favouriteService to handle the deletion logic and routesConstants for parameter configuration.
     *
     * @function
     */
    deleteFavouriteBook: controller.deleteById(
        favouriteService,
        'deleteFavouriteBook',
        routesConstants.userFavouriteBooks.params
    ),
};

export default favouriteController;
