/**
 * @fileoverview
 * This module defines the validation schema for operations related to recently visited books.
 * It utilizes Joi for schema validation and the validation service for defining object ID fields.
 * The validation schema ensures that incoming requests have the required structure and data types.
 */

import Joi from 'joi';
import validationService from '../../../../service/validation.service.js';

const add = Joi.object({
    /**
     * Validation schema for adding a recently visited book.
     *
     * This schema defines the required structure for a request to add a recently visited book. It ensures that the request contains a valid book ID, utilizing the object ID field definition from the validation service.
     *
     * @const {Joi.ObjectSchema} add
     * @memberof module:validators/recentlyVisitedBooksSchema
     *
     * @property {string} book - The ID of the book being added to the recently visited list. This field is required and must be a valid object ID.
     */
    book: validationService.objectIdField.required(),
}).strict();

/**
 * The validation schema for recently visited books operations.
 *
 * This object contains all the validation schemas related to recently visited books operations. Currently, it includes the schema for adding a recently visited book.
 *
 * @const {Object} recentlyVisitedBooksSchema
 * @memberof module:validators/recentlyVisitedBooksSchema
 *
 * @property {Joi.ObjectSchema} add - The validation schema for adding a recently visited book.
 */
const recentlyVisitedBooksSchema = {
    add,
};

export default recentlyVisitedBooksSchema;
