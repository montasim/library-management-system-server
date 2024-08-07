/**
 * @fileoverview This file defines validation middleware for subjects-related API requests. The
 * middleware functions use Joi schemas to validate request data for creating, retrieving, updating,
 * and deleting subjects. Each function ensures that the request data conforms to the defined
 * schema before proceeding to the next middleware or controller.
 */

import validateWithSchema from '../../../shared/validateWithSchema.js';
import subjectsSchema from './subjects.schema.js';

/**
 * createSubject - Middleware function to validate the request body when creating a new subject.
 * This function ensures that the request body contains valid data according to the createSubjectSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const createSubject = validateWithSchema([
    {
        schema: subjectsSchema.createSubjectSchema,
        property: 'body',
    },
]);

/**
 * getSubjects - Middleware function to validate the query parameters when retrieving a list of subjects.
 * This function ensures that the query parameters contain valid data according to the getSubjectsQuerySchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const getSubjects = validateWithSchema([
    {
        schema: subjectsSchema.getSubjectsQuerySchema,
        property: 'query',
    },
]);

/**
 * getSubjectById - Middleware function to validate the request parameters when retrieving a subject by its ID.
 * This function ensures that the request parameters contain a valid subject ID according to the subjectIdParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const getSubjectById = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdParamSchema,
        property: 'params',
    },
]);

/**
 * updateSubject - Middleware function to validate the request body and parameters when updating a subject by its ID.
 * This function ensures that the request body contains valid data according to the updateSubjectSchema and the request
 * parameters contain a valid subject ID according to the subjectIdParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const updateSubject = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdParamSchema,
        property: 'params',
    },
    {
        schema: subjectsSchema.updateSubjectSchema,
        property: 'body',
    },
]);

/**
 * deleteSubjects - Middleware function to validate the query parameters when deleting a list of subjects.
 * This function ensures that the query parameters contain valid data according to the subjectIdsParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const deleteSubjects = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdsParamSchema,
        property: 'query',
    },
]);

/**
 * deleteSubject - Middleware function to validate the request parameters when deleting a subject by its ID.
 * This function ensures that the request parameters contain a valid subject ID according to the subjectIdParamSchema.
 *
 * @param {Object} req - The request object containing the data to validate.
 * @param {Object} res - The response object to send validation errors or proceed with the request.
 * @param {Function} next - The next middleware function in the stack.
 */
const deleteSubject = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdParamSchema,
        property: 'params',
    },
]);

/**
 * subjectsValidator - Object containing all the defined validation middleware functions for subjects:
 *
 * - createSubject: Middleware function to validate the request body when creating a new subject.
 * - getSubjects: Middleware function to validate the query parameters when retrieving a list of subjects.
 * - getSubjectById: Middleware function to validate the request parameters when retrieving a subject by its ID.
 * - updateSubject: Middleware function to validate the request body and parameters when updating a subject by its ID.
 * - deleteSubjects: Middleware function to validate the query parameters when deleting a list of subjects.
 * - deleteSubject: Middleware function to validate the request parameters when deleting a subject by its ID.
 */
const subjectsValidator = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsValidator;
