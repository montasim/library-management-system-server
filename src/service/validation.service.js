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
        'string.pattern.base':
            'Please enter a valid Bangladeshi mobile number.',
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

const booleanField = Joi.boolean()
    .truthy('true') // Accepting these string values as `true`
    .falsy('false') // Accepting these string values as `false`
    .custom((value, helpers) => {
        // Ensuring the value is strictly a boolean or a truthy/falsy value we expect
        if (typeof value === 'boolean' || ['true', 'false'].includes(value)) {
            return value; // If it's an accepted value, use it as is
        } else {
            // This is where you can add additional logic if needed
            return helpers.error('boolean.base'); // Use the 'boolean.base' error key
        }
    })
    .messages({
        'boolean.base': '"{#label}" must be a boolean, true, or false', // Custom message for boolean error
        ...customValidationMessage, // Spreading additional custom messages if there are any
    });

const objectIdField = Joi.string()
    .length(24) // MongoDB ObjectId must be exactly 24 characters long
    .hex() // Ensures the string is a hexadecimal string
    .messages({
        'string.length': 'The ID must be valid .',
        'string.hex': 'The ID must be valid.',
        ...customValidationMessage, // Spread your custom messages if there are additional overrides
    });

const objectIdsField = Joi.string().custom((value, helpers) => {
    const ids = value.split(',');

    // Validate each ID against the objectIdField
    ids.forEach((id) => {
        const { error } = objectIdField.validate(id);
        if (error) {
            throw new Error(`Invalid ID provided: ${error.message}`);
        }
    });

    return value; // Return original value if all IDs pass validation
});

const dateField = Joi.string()
    .regex(patterns.ISO_8601_DATE, 'ISO 8601 date')
    .custom((value, helpers) => {
        // Attempt to parse the string as a Date object
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            // If the date is not valid, generate an error
            return helpers.error('date.iso', { value });
        }
        // Return the date in ISO string format if valid
        return date.toISOString();
    })
    .messages({
        'date.iso':
            '"{#label}" must be a valid ISO 8601 date including a timezone',
        'string.pattern.name':
            '"{#label}" must be a valid ISO 8601 date format',
        ...customValidationMessage,
    });

const validationService = {
    createStringField,
    mobileField,
    emailField,
    passwordField,
    booleanField,
    objectIdField,
    objectIdsField,
    dateField,
};

export default validationService;
