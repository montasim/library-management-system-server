/**
 * @fileoverview This module defines the validation middleware for translator-related operations.
 * It uses Joi schemas to validate request parameters and payloads for creating, retrieving, updating, and deleting translators.
 * The validation middleware ensures that the data conforms to the required formats and constraints before proceeding with the operation.
 */

import validateWithSchema from '../../../shared/validateWithSchema.js';
import translatorsSchema from './translators.schema.js';

/**
 * Middleware for validating the request body when creating a translator.
 *
 * @constant
 * @type {Function}
 * @memberof module:translatorsValidator
 * @description This middleware validates the request body against the `createTranslatorSchema`.
 */
const createTranslator = validateWithSchema([
    {
        schema: translatorsSchema.createTranslatorSchema,
        property: 'body',
    },
]);

/**
 * Middleware for validating query parameters when retrieving a list of translators.
 *
 * @constant
 * @type {Function}
 * @memberof module:translatorsValidator
 * @description This middleware validates the query parameters against the `getTranslatorsQuerySchema`.
 */
const getTranslators = validateWithSchema([
    {
        schema: translatorsSchema.getTranslatorsQuerySchema,
        property: 'query',
    },
]);

/**
 * Middleware for validating the request parameters when retrieving a specific translator by ID.
 *
 * @constant
 * @type {Function}
 * @memberof module:translatorsValidator
 * @description This middleware validates the request parameters against the `translatorIdParamSchema`.
 */
const getTranslator = validateWithSchema([
    {
        schema: translatorsSchema.translatorIdParamSchema,
        property: 'params',
    },
]);

/**
 * Middleware for validating the request parameters and body when updating a specific translator by ID.
 *
 * @constant
 * @type {Function}
 * @memberof module:translatorsValidator
 * @description This middleware validates the request parameters against the `translatorIdParamSchema` and the request body against the `updateTranslatorSchema`.
 */
const updateTranslator = validateWithSchema([
    {
        schema: translatorsSchema.translatorIdParamSchema,
        property: 'params',
    },
    {
        schema: translatorsSchema.updateTranslatorSchema,
        property: 'body',
    },
]);

/**
 * Middleware for validating query parameters when deleting multiple translators.
 *
 * @constant
 * @type {Function}
 * @memberof module:translatorsValidator
 * @description This middleware validates the query parameters against the `translatorIdsParamSchema`.
 */
const deleteTranslators = validateWithSchema([
    {
        schema: translatorsSchema.translatorIdsParamSchema,
        property: 'query',
    },
]);

/**
 * Middleware for validating the request parameters when deleting a specific translator by ID.
 *
 * @constant
 * @type {Function}
 * @memberof module:translatorsValidator
 * @description This middleware validates the request parameters against the `translatorIdParamSchema`.
 */
const deleteTranslator = validateWithSchema([
    {
        schema: translatorsSchema.translatorIdParamSchema,
        property: 'params',
    },
]);

/**
 * Object containing all the validation middleware for translator-related operations.
 *
 * @constant
 * @type {Object}
 * @property {Function} createTranslator - Middleware for validating the request body when creating a translator.
 * @property {Function} getTranslators - Middleware for validating query parameters when retrieving a list of translators.
 * @property {Function} getTranslator - Middleware for validating the request parameters when retrieving a specific translator by ID.
 * @property {Function} updateTranslator - Middleware for validating the request parameters and body when updating a specific translator by ID.
 * @property {Function} deleteTranslators - Middleware for validating query parameters when deleting multiple translators.
 * @property {Function} deleteTranslator - Middleware for validating the request parameters when deleting a specific translator by ID.
 */
const translatorsValidator = {
    createTranslator,
    getTranslators,
    getTranslator,
    updateTranslator,
    deleteTranslators,
    deleteTranslator,
};

export default translatorsValidator;
