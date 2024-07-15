import Joi from 'joi';

import validationService from '../../../../service/validation.service.js';
import returnBookConstants from './returnBooks.constant.js';

// Define base schema for permissions
const returnBookSchemaBase = Joi.object({
    user: validationService.objectIdField,
    bookId: validationService.objectIdField,
    remarks: validationService.createStringField(
        returnBookConstants.lengths.REMARKS_MIN,
        returnBookConstants.lengths.REMARKS_MAX
    ),
}).strict();

const returnSchema = returnBookSchemaBase.fork(
    ['user', 'bookId', 'remarks'],
    (field) => field.required()
);

const returnBookSchema = {
    returnSchema,
};

export default returnBookSchema;
