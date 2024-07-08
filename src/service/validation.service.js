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

const validationService = {
    createStringField,
    mobileField,
    emailField,
    passwordField,
};

export default validationService;
