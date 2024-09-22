/**
 * @fileoverview This file defines and exports the controller for handling user-related operations.
 * The controller functions handle retrieving a list of users and retrieving a user by ID. The controller leverages
 * generic functions from a shared controller module and utilizes the usersService for the actual data operations.
 */

import usersService from './users.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

/**
 * usersController - An object that holds controller functions for managing user-related operations.
 * Each function corresponds to a specific CRUD operation and utilizes the usersService for data handling.
 *
 * @typedef {Object} UsersController
 * @property {Function} getUserList - Controller function for retrieving a list of users.
 * @property {Function} getUserById - Controller function for retrieving a user by its ID.
 */
const usersController = {
    /**
     * getUserList - Controller function for retrieving a list of users.
     * Delegates the request to the generic getList function from the shared controller, which in turn calls the getUserList method of the usersService.
     */
    getUsersList: controller.getList(usersService, 'getUserList'),

    /**
     * getUserById - Controller function for retrieving a user by its ID.
     * Delegates the request to the generic getById function from the shared controller, which in turn calls the getUserById method of the usersService.
     * The ID parameter is defined in the routesConstants configuration.
     */
    getUserById: controller.getById(
        usersService,
        'getUserById',
        routesConstants.users.params
    ),
};

export default usersController;
