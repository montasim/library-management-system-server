/**
 * @fileoverview This file defines the controller functions for managing subjects. These functions
 * handle the creation, retrieval, updating, and deletion of subjects by interacting with the
 * subjects service. Each function utilizes a shared controller to streamline the handling of
 * standard CRUD operations.
 */

import subjectsService from './subjects.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

/**
 * subjectsController - Object containing all the defined controller functions for subjects management:
 *
 * - createSubject: Controller function to handle the creation of a new subject.
 * - getSubjects: Controller function to handle the retrieval of a list of subjects.
 * - getSubjectById: Controller function to handle the retrieval of a subject by its ID.
 * - updateSubject: Controller function to handle the updating of a subject by its ID.
 * - deleteSubject: Controller function to handle the deletion of a subject by its ID.
 * - deleteSubjects: Controller function to handle the deletion of a list of subjects.
 */
const subjectsController = {
    /**
     * createSubject - Controller function to handle the creation of a new subject. This function
     * delegates the creation logic to the subjects service and uses a shared controller method
     * to handle the request and response.
     *
     * @param {Object} req - The request object containing the subject data to create.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    createSubject: controller.create(subjectsService, 'createSubject'),

    /**
     * getSubjects - Controller function to handle the retrieval of a list of subjects. This function
     * delegates the retrieval logic to the subjects service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the query parameters.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getSubjects: controller.getList(subjectsService, 'getSubjects'),

    /**
     * getSubjectById - Controller function to handle the retrieval of a subject by its ID. This function
     * delegates the retrieval logic to the subjects service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the subject ID.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getSubjectById: controller.getById(
        subjectsService,
        'getSubjectById',
        routesConstants.subjects.params
    ),

    /**
     * updateSubject - Controller function to handle the updating of a subject by its ID. This function
     * delegates the update logic to the subjects service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the subject ID and update data.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    updateSubject: controller.updateById(
        subjectsService,
        'updateSubject',
        routesConstants.subjects.params
    ),

    /**
     * deleteSubject - Controller function to handle the deletion of a subject by its ID. This function
     * delegates the deletion logic to the subjects service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the subject ID.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    deleteSubject: controller.deleteById(
        subjectsService,
        'deleteSubject',
        routesConstants.subjects.params
    ),

    /**
     * deleteSubjects - Controller function to handle the deletion of a list of subjects. This function
     * delegates the deletion logic to the subjects service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the list of subject IDs.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    deleteSubjects: controller.deleteList(subjectsService, 'deleteSubjects'),
};

export default subjectsController;
