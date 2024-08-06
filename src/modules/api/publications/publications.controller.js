import publicationsService from './publications.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

const publicationsController = {
    createPublication: controller.create(
        publicationsService,
        'createPublication'
    ),
    getPublicationList: controller.getList(
        publicationsService,
        'getPublicationList'
    ),
    getPublicationById: controller.getById(
        publicationsService,
        'getPublicationById',
        routesConstants.publications.params
    ),
    updatePublicationById: controller.updateById(
        publicationsService,
        'updatePublicationById',
        routesConstants.publications.params
    ),
    deletePublicationById: controller.deleteById(
        publicationsService,
        'deletePublicationById',
        routesConstants.publications.params
    ),
    deletePublicationList: controller.deleteList(
        publicationsService,
        'deletePublicationList'
    ),
};

export default publicationsController;
