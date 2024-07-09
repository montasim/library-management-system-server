import Joi from 'joi';

import usersConstants from '../users/users.constants.js';
import validationService from '../../../service/validation.service.js';
import customValidationMessage from '../../../shared/customValidationMessage.js';

// Define base schema for subjects
const userSchemaBase = Joi.object({
    name: validationService
        .createStringField(
            usersConstants.lengths.NAME_MIN,
            usersConstants.lengths.NAME_MAX
        )
        .pattern(new RegExp(usersConstants.pattern.name))
        .messages({
            'string.pattern.base':
                'Name must start with an uppercase letter and follow with lowercase letters. If multiple words, each must start with uppercase followed by lowercase, with spaces between words. No numbers or special characters allowed.',
        }),
    mobile: validationService.mobileField,
    address: validationService
        .createStringField(
            usersConstants.lengths.ADDRESS_MIN,
            usersConstants.lengths.ADDRESS_MAX
        )
        .messages(customValidationMessage),
    department: validationService
        .createStringField(
            usersConstants.lengths.DEPARTMENT_MIN,
            usersConstants.lengths.DEPARTMENT_MAX
        )
        .messages(customValidationMessage),
    designation: validationService
        .createStringField(
            usersConstants.lengths.DESIGNATION_MIN,
            usersConstants.lengths.DESIGNATION_MAX
        )
        .messages(customValidationMessage),
}).strict();

const update = userSchemaBase
    .fork(['name', 'mobile', 'address', 'department', 'designation'], (field) =>
        field.optional()
    )
    .min(1);

const usersSchema = {
    update,
};

export default usersSchema;
