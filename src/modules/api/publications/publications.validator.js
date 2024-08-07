/**
 * @fileoverview This file defines validation middleware for publications-related API requests. The
 * middleware functions use Joi schemas to validate request data for creating, retrieving, updating,
 * and deleting publications. Each function ensures that the request data conforms to the defined
 * schema before proceeding to the next middleware or controller.
 */

import validateWithSchema from '../../../shared/validateWithSchema.js';
import publicationsSchema from './publications.schema.js';

/**
 * createPublication - Middleware function to validate the request body when creating a new publication.
 * This function ensures that the request body contains valid data according to the createPublicationSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const createPublication = validateWithSchema([
    {
        schema: publicationsSchema.createPublicationSchema,
        property: 'body',
    },
]);

/**
 * getPublicationList - Middleware function to validate the query parameters when retrieving a list of publications.
 * This function ensures that the query parameters contain valid data according to the getPublicationsQuerySchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const getPublicationList = validateWithSchema([
    {
        schema: publicationsSchema.getPublicationsQuerySchema,
        property: 'query',
    },
]);

/**
 * getPublicationById - Middleware function to validate the request parameters when retrieving a publication by its ID.
 * This function ensures that the request parameters contain a valid publication ID according to the publicationIdParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const getPublicationById = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
]);

/**
 * updatePublicationById - Middleware function to validate the request body and parameters when updating a publication by its ID.
 * This function ensures that the request body contains valid data according to the updatePublicationSchema and the request
 * parameters contain a valid publication ID according to the publicationIdParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const updatePublicationById = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
    {
        schema: publicationsSchema.updatePublicationSchema,
        property: 'body',
    },
]);

/**
 * deletePublicationList - Middleware function to validate the query parameters when deleting a list of publications.
 * This function ensures that the query parameters contain valid data according to the publicationIdsParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const deletePublicationList = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdsParamSchema,
        property: 'query',
    },
]);

/**
 * deletePublicationById - Middleware function to validate the request parameters when deleting a publication by its ID.
 * This function ensures that the request parameters contain a valid publication ID according to the publicationIdParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const deletePublicationById = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
]);

/**
 * publicationsValidator - Object containing all the defined validation middleware functions for publications:
 *
 * - createPublication: Middleware function to validate the request body when creating a new publication.
 * - getPublicationList: Middleware function to validate the query parameters when retrieving a list of publications.
 * - getPublicationById: Middleware function to validate the request parameters when retrieving a publication by its ID.
 * - updatePublicationById: Middleware function to validate the request body and parameters when updating a publication by its ID.
 * - deletePublicationList: Middleware function to validate the query parameters when deleting a list of publications.
 * - deletePublicationById: Middleware function to validate the request parameters when deleting a publication by its ID.
 */
const publicationsValidator = {
    createPublication,
    getPublicationList,
    getPublicationById,
    updatePublicationById,
    deletePublicationList,
    deletePublicationById,
};

export default publicationsValidator;
