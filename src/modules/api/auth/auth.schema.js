import Joi from 'joi';

import customValidationMessage from '../../../shared/customValidationMessage.js';
import patterns from '../../../constant/patterns.constants.js';
import userConstants from '../users/users.constants.js';

// Define base schema for subjects
const userSchemaBase = Joi.object({
    name: Joi.string()
        .trim()
        .min(userConstants.lengths.NAME_MIN)
        .max(userConstants.lengths.NAME_MAX)
        .messages(customValidationMessage),
    email: Joi.string()
        .trim()
        .pattern(patterns.EMAIL)
        .min(userConstants.lengths.EMAIL_MIN)
        .max(userConstants.lengths.EMAIL_MAX)
        .messages({
            'string.pattern.base': 'Please fill a valid email address',
            ...customValidationMessage,
        }),
    mobile: Joi.string()
        .trim()
        .pattern(patterns.MOBILE)
        .min(userConstants.lengths.MOBILE_MIN)
        .max(userConstants.lengths.MOBILE_MAX)
        .messages({
            'string.pattern.base':
                'Please enter a valid Bangladeshi mobile number',
            ...customValidationMessage,
        }),
    address: Joi.string()
        .trim()
        .min(userConstants.lengths.ADDRESS_MIN)
        .max(userConstants.lengths.ADDRESS_MAX)
        .messages(customValidationMessage),
    department: Joi.string()
        .trim()
        .min(userConstants.lengths.DEPARTMENT_MIN)
        .max(userConstants.lengths.DEPARTMENT_MAX)
        .messages(customValidationMessage),
    designation: Joi.string()
        .trim()
        .min(userConstants.lengths.DESIGNATION_MIN)
        .max(userConstants.lengths.DESIGNATION_MAX)
        .messages(customValidationMessage),
    password: Joi.string()
        .trim()
        .min(userConstants.lengths.PASSWORD_MIN)
        .max(userConstants.lengths.PASSWORD_MAX)
        .messages(customValidationMessage),
    confirmPassword: Joi.string()
        .trim()
        .min(userConstants.lengths.PASSWORD_MIN)
        .max(userConstants.lengths.PASSWORD_MAX)
        .messages(customValidationMessage),
    isActive: Joi.boolean().default(true).messages(customValidationMessage),
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

const login = userSchemaBase.fork(['email', 'password'], (field) =>
    field.required()
);

const authSchema = {
    signup,
    verify,
    resendVerification,
    login,
};

export default authSchema;
