import Joi from 'joi';

import customValidationMessage from '../shared/customValidationMessage.js';
import userConstants from '../modules/api/users/users.constants.js';
import patterns from '../constant/patterns.constants.js';

const createStringField = (min, max) =>
    Joi.string().trim().min(min).max(max).messages(customValidationMessage);

const mobileField = Joi.object({
    mobileNumber: Joi.string()
        .pattern(patterns.MOBILE)
        .required()
        .messages({
            'string.base': 'Mobile number must be a string.',
            'string.empty': 'Mobile number cannot be empty.',
            'string.pattern.base': 'Please provide a valid Bangladeshi mobile number. Valid formats are 01XXXXXXXXX or +8801XXXXXXXXX, where X is a digit.',
            'any.required': 'Mobile number is required and cannot be omitted.'
        })
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

const generateExtensionRegexPattern = ( allowedExtensions ) => {
    return `(${allowedExtensions.join('|')})$`;
};

const createFileNameSchema = ( allowedExtensions ) => {
    const regexPattern = generateExtensionRegexPattern(allowedExtensions);

    return Joi.string()
        .regex(new RegExp(regexPattern))
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.base': 'File name must be a string',
            'string.empty': 'File name cannot be empty',
            'string.min': 'File name must be at least {#limit} characters long',
            'string.max': 'File name must be at most {#limit} characters long',
            'any.required': 'File name is required',
            'string.pattern.base': `File name is not in a valid format. It should contain only letters, numbers, underscores, hyphens, and spaces, and have one of the following extensions: ${allowedExtensions}`,
        });
};

const fileBufferValidationSchema = () => {
    return Joi.binary()
        .max(1024 * 1024 * 25) // Example size limit of 25MB
        .required()
        .messages({
            'binary.base': 'Buffer must be a valid binary buffer',
            'binary.max': 'Buffer size must not exceed 25MB',
            'any.required': 'Buffer is a required field'
        })
};

const fileField = (allowedFieldName, allowedExtensions, validMimeTypes, maxSize) => {
    return Joi.object({
        fieldname: Joi.string()
            .valid(allowedFieldName)
            .required()
            .messages({
                'string.base': `"fieldname" should be a type of 'text'`,
                'any.only': `"File should be one of [${allowedFieldName}]`,
                'any.required': `Invalid or empty file`
            }),
        originalname: createFileNameSchema(allowedExtensions)
            .messages({
                'string.pattern.base': `File should have one of the following extensions: ${allowedExtensions.join(', ')}`,
                'any.required': `Invalid or empty file`
            }),
        encoding: Joi.string()
            .valid('7bit')
            .required()
            .messages({
                'string.base': `"encoding" should be a type of 'text'`,
                'any.only': `Invalid or empty file`,
                'any.required': `Invalid or empty file`
            }),
        mimetype: Joi.string()
            .valid(...validMimeTypes)
            .required()
            .messages({
                'string.base': `"mimetype" should be a type of 'text'`,
                'any.only': `Invalid or empty file`,
                'any.required': `Invalid or empty file`
            }),
        buffer: fileBufferValidationSchema(),
        size: Joi.number()
            .max(maxSize)
            .required()
            .messages({
                'number.base': `"size" should be a number`,
                'number.max': `"size" must not exceed 1.1MB`,
                'any.required': `File must not exceed 1.1MB`
            })
    }).description('File to be uploaded with validated MIME type and size.')
};

const validationService = {
    createStringField,
    mobileField,
    emailField,
    passwordField,
    booleanField,
    objectIdField,
    objectIdsField,
    dateField,
    fileField,
};

export default validationService;
