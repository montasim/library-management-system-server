/**
 * @fileoverview This file defines and exports validation middleware for user-related operations.
 * These middleware functions validate the input data for various endpoints related to users,
 * ensuring that the incoming requests meet the specified criteria before proceeding.
 */

import validateWithSchema from '../../../shared/validateWithSchema.js';
import usersSchema from './users.schema.js';

/**
 * getUserList - Middleware for validating the query parameters when retrieving a list of users.
 * Ensures that the query parameters meet the specified criteria.
 */
const getUsersList = validateWithSchema([
    {
        schema: usersSchema.getUsersQuerySchema,
        property: 'query',
    },
]);

/**
 * getUserById - Middleware for validating the request parameters when retrieving a user by its ID.
 * Ensures that the user ID meets the specified criteria.
 */
const getUserById = validateWithSchema([
    {
        schema: usersSchema.userIdParamSchema,
        property: 'params',
    },
]);

/**
 * usersValidator - An object that holds the validation middleware for user-related operations.
 * These middleware functions validate the input data for retrieving users,
 * ensuring that the incoming requests meet the specified criteria before proceeding.
 *
 * @typedef {Object} UsersValidator
 * @property {Function} getUserList - Middleware for validating the query parameters when retrieving a list of users.
 * @property {Function} getUserById - Middleware for validating the request parameters when retrieving a user by its ID.
 */
const usersValidator = {
    getUsersList,
    getUserById,
};

export default usersValidator;
