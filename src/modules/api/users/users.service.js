/**
 * @fileoverview This file defines and exports the service functions for managing users.
 * These services include functions for retrieving users.
 * The functions handle validation, and database operations, ensuring data integrity
 * and proper handling of related entities such as createdBy and updatedBy.
 */

import UsersModel from './users.model.js';
import service from '../../../shared/service.js';

/**
 * Helper function to populate user fields with related data.
 *
 * @param {Object} query - Mongoose query object.
 * @returns {Promise<Object>} - Populated query result.
 */
const populateUserFields = async (query) => {
    return await query
        .select('-createdBy -updatedBy');
};

/**
 * Retrieves a list of users from the database based on query parameters.
 *
 * @param {Object} params - Query parameters for filtering and pagination.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the list of users.
 */
const getUserList = async (params) => {
    return service.getResourceList(
        UsersModel,
        populateUserFields,
        params,
        {},
        'User'
    );
};

/**
 * Retrieves a user by its ID from the database.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to the response object containing the user details.
 */
const getUserById = async (userId) => {
    return service.getResourceById(
        UsersModel,
        populateUserFields,
        userId,
        'User'
    );
};

/**
 * usersService - An object that holds the service functions for managing user-related operations.
 * These functions handle the retrieval of users, including validation
 * of related data.
 *
 * @typedef {Object} UsersService
 * @property {Function} getUserList - Retrieves a list of users from the database based on query parameters.
 * @property {Function} getUserById - Retrieves a user by its ID from the database.
 */
const usersService = {
    getUserList,
    getUserById,
};

export default usersService;
