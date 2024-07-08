import Joi from 'joi';

import customValidationMessage from '../../../shared/customValidationMessage.js';
import userConstants from '../users/users.constants.js';
import validationService from '../../../service/validation.service.js';

// Define base schema for subjects
const authSchemaBase = Joi.object({
    name: validationService.createStringField(
        userConstants.lengths.NAME_MIN,
        userConstants.lengths.NAME_MAX
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
}).strict();

const signup = authSchemaBase.fork(
    ['name', 'email', 'password', 'confirmPassword'],
    (field) => field.required()
);

const verify = Joi.object({
    token: Joi.string().required().messages(customValidationMessage),
}).strict();

const resendVerification = Joi.object({
    id: Joi.string().alphanum().required().messages(customValidationMessage),
}).strict();

const requestNewPassword = Joi.object({
    email: validationService.emailField.required(),
}).strict();

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
