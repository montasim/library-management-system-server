/**
 * @fileoverview This file defines the controller functions for managing publications. These functions
 * handle the creation, retrieval, updating, and deletion of publications by interacting with the
 * publications service. Each function utilizes a shared controller to streamline the handling of
 * standard CRUD operations.
 */

import publicationsService from './publications.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

/**
 * publicationsController - Object containing all the defined controller functions for publications management:
 *
 * - createPublication: Controller function to handle the creation of a new publication.
 * - getPublicationList: Controller function to handle the retrieval of a list of publications.
 * - getPublicationById: Controller function to handle the retrieval of a publication by its ID.
 * - updatePublicationById: Controller function to handle the updating of a publication by its ID.
 * - deletePublicationById: Controller function to handle the deletion of a publication by its ID.
 * - deletePublicationList: Controller function to handle the deletion of a list of publications.
 */
const publicationsController = {
    /**
     * createPublication - Controller function to handle the creation of a new publication. This function
     * delegates the creation logic to the publications service and uses a shared controller method
     * to handle the request and response.
     *
     * @param {Object} req - The request object containing the publication data to create.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    createPublication: controller.create(
        publicationsService,
        'createPublication'
    ),

    /**
     * getPublicationList - Controller function to handle the retrieval of a list of publications. This function
     * delegates the retrieval logic to the publications service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the query parameters.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getPublicationList: controller.getList(
        publicationsService,
        'getPublicationList'
    ),

    /**
     * getPublicationById - Controller function to handle the retrieval of a publication by its ID. This function
     * delegates the retrieval logic to the publications service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the publication ID.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    getPublicationById: controller.getById(
        publicationsService,
        'getPublicationById',
        routesConstants.publications.params
    ),

    /**
     * updatePublicationById - Controller function to handle the updating of a publication by its ID. This function
     * delegates the update logic to the publications service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the publication ID and update data.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    updatePublicationById: controller.updateById(
        publicationsService,
        'updatePublicationById',
        routesConstants.publications.params
    ),

    /**
     * deletePublicationById - Controller function to handle the deletion of a publication by its ID. This function
     * delegates the deletion logic to the publications service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the publication ID.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    deletePublicationById: controller.deleteById(
        publicationsService,
        'deletePublicationById',
        routesConstants.publications.params
    ),

    /**
     * deletePublicationList - Controller function to handle the deletion of a list of publications. This function
     * delegates the deletion logic to the publications service and uses a shared controller method to handle
     * the request and response.
     *
     * @param {Object} req - The request object containing the list of publication IDs.
     * @param {Object} res - The response object to send the result or error.
     * @param {Function} next - The next middleware function in the stack.
     */
    deletePublicationList: controller.deleteList(
        publicationsService,
        'deletePublicationList'
    ),
};

export default publicationsController;
