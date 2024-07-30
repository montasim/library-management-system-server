import Joi from 'joi';

import usersConstants from '../users/users.constants.js';
import validationService from '../../../service/validation.service.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';
import constants from '../../../constant/constants.js';
import userConstants from '../users/users.constants.js';

// Define base schema for subjects
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
}).strict();

const updateUserProfile = userSchemaBase
    .fork(
        ['name', 'username', 'mobile', 'address', 'department', 'designation'],
        (field) => field.optional()
    )
    .min(1);

const deleteUser = userSchemaBase.fork(['confirmationText'], (field) =>
    field.required()
);

const updateAppearance = userSchemaBase.fork(['theme'], (field) =>
    field.required()
);

const usersSchema = {
    updateUserProfile,
    deleteUser,
    updateAppearance,
};

export default usersSchema;
