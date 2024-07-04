import Joi from 'joi';

import customValidationMessage from '../../../shared/customValidationMessage.js';
import patterns from '../../../constant/patterns.constants.js';
import userConstants from '../users/users.constants.js';

// Utility function to create reusable string fields with custom validation messages
const createStringField = (min, max) =>
    Joi.string().trim().min(min).max(max).messages(customValidationMessage);

const emailField = createStringField(userConstants.lengths.EMAIL_MIN, userConstants.lengths.EMAIL_MAX)
    .pattern(patterns.EMAIL)
    .messages({
        'string.pattern.base': 'Please fill a valid email address',
    });

const mobileField = createStringField(userConstants.lengths.MOBILE_MIN, userConstants.lengths.MOBILE_MAX)
    .pattern(patterns.MOBILE)
    .messages({
        'string.pattern.base': 'Please enter a valid Bangladeshi mobile number',
    });

const passwordField = createStringField(userConstants.lengths.PASSWORD_MIN, userConstants.lengths.PASSWORD_MAX);

// Define base schema for subjects
const userSchemaBase = Joi.object({
    name: createStringField(userConstants.lengths.NAME_MIN, userConstants.lengths.NAME_MAX),
    email: emailField,
    mobile: mobileField,
    address: createStringField(userConstants.lengths.ADDRESS_MIN, userConstants.lengths.ADDRESS_MAX),
    department: createStringField(userConstants.lengths.DEPARTMENT_MIN, userConstants.lengths.DEPARTMENT_MAX),
    designation: createStringField(userConstants.lengths.DESIGNATION_MIN, userConstants.lengths.DESIGNATION_MAX),
    password: passwordField,
    confirmPassword: Joi.valid(Joi.ref('password'))
        .messages({'any.only': 'Passwords do not match'}),
    oldPassword: passwordField,
    newPassword: passwordField,
    confirmNewPassword: Joi.valid(Joi.ref('newPassword'))
        .messages({'any.only': 'New passwords do not match'}),
    isActive: Joi.boolean().default(true),
}).strict();

const signup = userSchemaBase.fork(
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
    email: emailField.required(),
}).strict();

const resetPassword = userSchemaBase.fork(
    ['oldPassword', 'newPassword', 'confirmNewPassword'],
    (field) => field.required()
);

const login = userSchemaBase.fork(['email', 'password'], (field) =>
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
