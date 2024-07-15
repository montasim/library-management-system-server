import Joi from 'joi';

import customValidationMessage from '../shared/customValidationMessage.js';
import userConstants from '../modules/api/users/users.constants.js';
import patterns from '../constant/patterns.constants.js';

const createStringField = (min, max) =>
    Joi.string().trim().min(min).max(max).messages(customValidationMessage);

const mobileField = Joi.object({
    mobileNumber: Joi.string().pattern(patterns.MOBILE).required().messages({
        'string.base': 'Mobile number must be a string.',
        'string.empty': 'Mobile number cannot be empty.',
        'string.pattern.base':
            'Please provide a valid Bangladeshi mobile number. Valid formats are 01XXXXXXXXX or +8801XXXXXXXXX, where X is a digit.',
        'any.required': 'Mobile number is required and cannot be omitted.',
    }),
});

const emailField = createStringField(
    userConstants.lengths.EMAIL_MIN,
    userConstants.lengths.EMAIL_MAX
)
    .email({ minDomainSegments: 2, tlds: { allow: true } })
    .regex(/^((?!tempmail|mailinator|yopmail).)*$/, 'no-temp-email')
    .pattern(patterns.EMAIL)
    .messages({
        'string.pattern.name': '"email" must not be a temporary email address',
        'string.regex.no-temp-email': '"email" must not be from a temporary email provider (like tempmail, mailinator, or yopmail)',
        'string.pattern.base': 'Please fill a valid email address.',
    })

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
        'boolean.base': '{#label} should be either true or false. Acceptable values are true, false, "true", and "false".',
        ...customValidationMessage
    })
    .description('A boolean value, which can be true or false, including string representations.');

const objectIdField = Joi.string()
    .length(24) // MongoDB ObjectId must be exactly 24 characters long
    .hex() // Ensures the string is a hexadecimal string
    .messages({
        'string.length': '{#label} must be exactly 24 characters long.',
        'string.hex': '{#label} must consist only of hexadecimal characters.',
        ...customValidationMessage
    })
    .description('A valid MongoDB ObjectId, which must be 24 hexadecimal characters.');

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
        'date.iso': '{#label} must be in valid ISO 8601 format, including a timezone.',
        'string.pattern.name': '{#label} is not formatted correctly as an ISO 8601 date.',
        ...customValidationMessage,
    })
    .description('An ISO 8601 formatted date string, including a timezone, e.g., 2021-03-19T04:00:00Z.');

const generateExtensionRegexPattern = (allowedExtensions) => {
    return `(${allowedExtensions.join('|')})$`;
};

const createFileNameSchema = (allowedExtensions) => {
    const regexPattern = generateExtensionRegexPattern(allowedExtensions);

    return Joi.string()
        .regex(new RegExp(regexPattern))
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.base': 'The file name must consist of text.',
            'string.empty': 'The file name cannot be empty. Please provide a file name.',
            'string.min': 'The file name must be at least {#limit} character long.',
            'string.max': 'The file name must not exceed {#limit} characters.',
            'any.required': 'A file name is required to proceed.',
            'string.pattern.base': `The file name is not in a valid format. It must end with one of the following extensions: ${allowedExtensions.join(', ')}. Please check your file and try again.`,
        })
        .description('Validates the file name ensuring it has acceptable characters and extension.');
};

const fileBufferValidationSchema = () => {
    return Joi.binary()
        .max(1024 * 1024 * 25) // Example size limit of 25MB
        .required()
        .messages({
            'binary.base': 'The provided data must be a binary buffer.',
            'binary.max': 'The buffer size must not exceed 25MB. Please reduce the file size before uploading.',
            'any.required': 'File data is required. Please upload a file.',
        })
        .description('Validates the binary buffer of a file, ensuring it does not exceed the maximum allowed size.');
};

const fileField = (
    allowedFieldName,
    allowedExtensions,
    validMimeTypes,
    maxSize
) => {
    return Joi.object({
        fieldname: Joi.string()
            .valid(allowedFieldName)
            .required()
            .messages({
                'string.base': `"fieldname" must be text.`,
                'any.only': `The file should be uploaded under the field name "${allowedFieldName}".`,
                'any.required': `A field name is required and must match "${allowedFieldName}".`,
            })
            .description('Validates the form field name against expected values to ensure correct file categorization.'),
        originalname: createFileNameSchema(allowedExtensions),
        encoding: Joi.string()
            .valid('7bit')
            .required()
            .messages({
                'string.base': `"encoding" must be text.`,
                'any.only': `The encoding type must be "7bit".`,
                'any.required': `File encoding information is required.`,
            })
            .description('Validates the file encoding type, ensuring it is supported by the server.'),
        mimetype: Joi.string()
            .valid(...validMimeTypes)
            .required()
            .messages({
                'string.base': `"mimetype" must be text.`,
                'any.only': `The file type is not supported. Supported types include: ${validMimeTypes.join(', ')}.`,
                'any.required': `MIME type information is required.`,
            })
            .description('Checks the MIME type of the file against a set of valid MIME types to ensure compatibility.'),
        buffer: fileBufferValidationSchema(),
        size: Joi.number()
            .max(maxSize)
            .required()
            .messages({
                'number.base': `"size" must be a number.`,
                'number.max': `"size" must not exceed ${maxSize / (1024 * 1024)}MB.`,
                'any.required': `File size information is required.`,
            })
            .description('Validates the file size, ensuring it does not exceed the maximum allowed limit.'),
    }).description('A comprehensive file validation schema that includes checks for field name, file name, MIME type, and size.');
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
