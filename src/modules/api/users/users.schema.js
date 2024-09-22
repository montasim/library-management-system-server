/**
 * @fileoverview This file defines various Joi schemas for validating user-related data.
 * The schemas include base validation for user fields, as well as specific schemas for updating user profiles,
 * deleting user accounts, and updating user appearance settings. These schemas ensure that data conforms to the required formats,
 * lengths, and patterns, and include custom validation messages for better error reporting.
 */

import Joi from 'joi';

import usersConstants from '../users/users.constants.js';
import validationService from '../../../service/validation.service.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import constants from '../../../constant/constants.js';
import userConstants from '../users/users.constants.js';

/**
 * Base Joi schema for validating user-related fields.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema includes validation rules for:
 * - name: String (pattern: uppercase followed by lowercase, no special characters or numbers)
 * - username: String (pattern: unique, lowercase letters, numbers, underscores)
 * - mobile: String (validated using a custom mobile field validator)
 * - address: String (custom validation messages for address constraints)
 * - department: String (custom validation messages for department constraints)
 * - designation: String (custom validation messages for designation constraints)
 * - confirmationText: String (must match the predefined confirmation text for account deletion)
 * - theme: Object (required, containing the name of the theme)
 */
const userSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            usersConstants.lengths.NAME.FIRST_MIN,
            usersConstants.lengths.NAME.FIRST_MAX
        )
        .pattern(new RegExp(usersConstants.pattern.name))
        .messages({
            'string.pattern.base':
                'Name must start with an uppercase letter and follow with lowercase letters. If multiple words, each must start with uppercase followed by lowercase, with spaces between words. No numbers or special characters allowed.',
        }),
    username: validationService
        .createStringField(
            constants.lengths.USERNAME_MIN,
            constants.lengths.USERNAME_MAX
        )
        .pattern(new RegExp(userConstants.pattern.USERNAME))
        .messages({
            'string.pattern.base': 'Username, must be unique.',
        }),
    mobile: validationService.mobileField,
    address: validationService
        .createStringField(
            usersConstants.lengths.ADDRESS_MIN,
            usersConstants.lengths.ADDRESS_MAX
        )
        .messages(customValidationMessage),
    department: validationService
        .createStringField(
            usersConstants.lengths.DEPARTMENT_MIN,
            usersConstants.lengths.DEPARTMENT_MAX
        )
        .messages(customValidationMessage),
    designation: validationService
        .createStringField(
            usersConstants.lengths.DESIGNATION_MIN,
            usersConstants.lengths.DESIGNATION_MAX
        )
        .messages(customValidationMessage),
    confirmationText: Joi.string()
        .trim()
        .valid(constants.confirmationText.deleteUserAccount)
        .messages({
            'string.empty': 'Confirmation text cannot be empty.',
            'any.only': `Confirmation text must be exactly: '${constants.confirmationText.deleteUserAccount}'`,
        }),
    theme: Joi.object({
        name: Joi.string()
            .required()
            .trim()
            .description(
                'The name of the theme chosen by the user. This setting determines the overall look and feel of the application, enabling a personalized user experience.'
            ),
    }),
    limit: Joi.string()
        .min(1)
        .max(100)
        .default(10)
        .custom((value, helpers) => parseInt(value))
        .description(
            'Limit for query results, used in pagination to specify how many items to return.'
        ),
    sort: Joi.string()
        .trim()
        .default('createdAt')
        .description(
            'Sorting parameter for the query results, defaulting to the creation date.'
        ),
    isActive: validationService.booleanField,
    createdBy: validationService.objectIdField,
    updatedBy: validationService.objectIdField,
    createdAt: validationService.dateField,
    updatedAt: validationService.dateField,
}).strict();

/**
 * Joi schema for validating data when updating a user profile.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema extends the base user schema and makes fields like name, username, mobile, address, department, and designation optional.
 * It ensures that at least one field is provided for the update.
 */
const updateUserProfile = userSchemaBase
    .fork(
        ['name', 'username', 'mobile', 'address', 'department', 'designation'],
        (field) => field.optional()
    )
    .min(1);

/**
 * Joi schema for validating data when deleting a user account.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema extends the base user schema and requires the confirmationText field.
 */
const deleteUser = userSchemaBase.fork(['confirmationText'], (field) =>
    field.required()
);

/**
 * Joi schema for validating data when updating user appearance settings.
 *
 * @constant
 * @type {Joi.ObjectSchema}
 * @description This schema extends the base user schema and requires the theme field.
 */
const updateAppearance = userSchemaBase.fork(['theme'], (field) =>
    field.required()
);

/**
 * getBooksQuerySchema - Joi schema for validating query parameters when retrieving a list of books.
 * Ensures that parameters such as name, isActive, limit, sort, createdBy, updatedBy, createdAt,
 * and updatedAt are optional and meet the specified criteria.
 *
 * @function
 */
const getUsersQuerySchema = userSchemaBase.fork(
    [
        'name',
        'isActive',
        'limit',
        'sort',
        'createdBy',
        'updatedBy',
        'createdAt',
        'updatedBy',
    ],
    (field) => field.optional()
);

/**
 * userIdParamSchema - Joi schema for validating a single user ID.
 * Ensures that the userId field is a valid MongoDB ObjectId.
 *
 * @function
 */
const userIdParamSchema = Joi.object({
    userId: validationService.objectIdField
        .required()
        .description('The user ID. ID must be a valid MongoDB ObjectId.'),
}).strict();

/**
 * Object containing all the defined Joi schemas for user validation.
 *
 * @constant
 * @type {Object}
 * @property {Joi.ObjectSchema} updateUserProfile - Schema for validating data when updating a user profile.
 * @property {Joi.ObjectSchema} deleteUser - Schema for validating data when deleting a user account.
 * @property {Joi.ObjectSchema} updateAppearance - Schema for validating data when updating user appearance settings.
 * @property {Object} getUsersQuerySchema - Joi schema for validating query parameters when retrieving a list of users.
 * @property {Object} userIdParamSchema - Joi schema for validating a single user ID.
 */
const usersSchema = {
    updateUserProfile,
    deleteUser,
    updateAppearance,
    getUsersQuerySchema,
    userIdParamSchema,
};

export default usersSchema;
