import Joi from 'joi';

import customValidationMessage from '../../../shared/customValidationMessage.js';
import userConstants from '../users/users.constants.js';
import validationService from '../../../service/validation.service.js';

// Define base schema for subjects
const authSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            userConstants.lengths.NAME.FIRST_MIN,
            userConstants.lengths.NAME.FIRST_MAX
        )
        .regex(userConstants.pattern.NAME)
        .messages({
            'string.pattern.base': `{#label} with value "{#value}" must start with an uppercase letter followed by lowercase letters for each word, separated by a single space if multiple words. No numbers or special characters are allowed.`,
        }),
    dateOfBirth: Joi.string()
        .regex(userConstants.pattern.DATE_OF_BIRTH)
        .message(
            'Date of birth must be in the format DD-MM-YYYY and a valid date.'
        ),
    email: validationService.emailField,
    password: validationService.passwordField,
    confirmPassword: Joi.valid(Joi.ref('password')).messages({
        'any.only': 'Passwords do not match',
    }),
    oldPassword: validationService.passwordField,
    newPassword: validationService.passwordField,
    confirmNewPassword: Joi.valid(Joi.ref('newPassword')).messages({
        'any.only': 'New passwords do not match',
    }),
    token: Joi.string()
        .length(40) // Length should be 40 characters for a 20-byte hex string
        .hex() // Validate that the string is a hexadecimal number
        .messages({
            'string.length': `{#label} must be exactly 40 characters long.`,
            'string.hex': `{#label} must only consist of hexadecimal characters (0-9, a-f).`,
            ...customValidationMessage,
        }),
    id: validationService.objectIdField,
}).strict();

const signup = authSchemaBase.fork(
    ['name', 'dateOfBirth', 'email', 'password', 'confirmPassword'],
    (field) => field.required()
);

const verify = authSchemaBase.fork(['token'], (field) => field.required());

const resendVerification = authSchemaBase.fork(['id'], (field) =>
    field.required()
);

const requestNewPassword = authSchemaBase.fork(['email'], (field) =>
    field.required()
);

const resetPassword = authSchemaBase.fork(
    ['oldPassword', 'newPassword', 'confirmNewPassword'],
    (field) => field.required()
);

const login = authSchemaBase.fork(['email', 'password'], (field) =>
    field.required()
);

const authSchema = {
    signup,
    verify,
    resendVerification,
    requestNewPassword,
    resetPassword,
    login,
};

export default authSchema;
