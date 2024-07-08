import Joi from 'joi';

import customValidationMessage from '../shared/customValidationMessage.js';
import userConstants from '../modules/api/users/users.constants.js';
import patterns from '../constant/patterns.constants.js';

const createStringField = (min, max) =>
    Joi.string().trim().min(min).max(max).messages(customValidationMessage);

const mobileField = createStringField(
    userConstants.lengths.MOBILE_MIN,
    userConstants.lengths.MOBILE_MAX
)
    .pattern(patterns.MOBILE)
    .messages({
        'string.pattern.base': 'Please enter a valid Bangladeshi mobile number.',
    });

const emailField = createStringField(
    userConstants.lengths.EMAIL_MIN,
    userConstants.lengths.EMAIL_MAX
)
    .pattern(patterns.EMAIL)
    .messages({
        'string.pattern.base': 'Please fill a valid email address.',
    });

const passwordField = createStringField(
    userConstants.lengths.PASSWORD_MIN,
    userConstants.lengths.PASSWORD_MAX
)
    .pattern(patterns.PASSWORD)
    .messages({
        'string.pattern.base': 'Please provide a valid password.',
    });

const booleanField = Joi.boolean().messages(customValidationMessage);

const objectIdField = Joi.string()
    .length(24) // MongoDB ObjectId must be exactly 24 characters long
    .hex() // Ensures the string is a hexadecimal string
    .messages({
        'string.length': 'The ID must be exactly 24 characters long.',
        'string.hex': 'The ID must be a valid hexadecimal string.',
        ...customValidationMessage  // Spread your custom messages if there are additional overrides
    });

const validationService = {
    createStringField,
    mobileField,
    emailField,
    passwordField,
    booleanField,
    objectIdField,
};

export default validationService;
