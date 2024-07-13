import Joi from 'joi';
import validationService from '../../../../service/validation.service.js';
import adminConstants from './admin.constants.js';
import customValidationMessage
    from '../../../../shared/customValidationMessage.js';

// Define base schema for subjects
const authSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            adminConstants.lengths.NAME_MIN,
            adminConstants.lengths.NAME_MAX
        )
        .regex(adminConstants.pattern.name)
        .messages({
            'string.pattern.base': `{#label} with value "{#value}" must start with an uppercase letter followed by lowercase letters for each word, separated by a single space if multiple words. No numbers or special characters are allowed.`,
        }),
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

const createAdmin = authSchemaBase.fork(
    ['name', 'email'],
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

const adminSchema = {
    createAdmin,
    verify,
    resendVerification,
    requestNewPassword,
    resetPassword,
    login,
};

export default adminSchema;
