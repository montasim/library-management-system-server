import publicationsService from './publications.service.js';
import entity from '../../../shared/entity.js';
import routesConstants from '../../../constant/routes.constants.js';

const publicationsController = {
    createPublication: entity.createEntity(publicationsService, 'createPublication'),
    getPublicationList: entity.getEntityList(publicationsService, 'getPublicationList'),
    getPublicationById: entity.getEntityById(publicationsService, 'getPublicationById', routesConstants.publications.params),
    updatePublicationById: entity.updateEntityById(publicationsService, 'updatePublicationById', routesConstants.publications.params),
    deletePublicationById: entity.deleteEntityById(publicationsService, 'deletePublicationById', routesConstants.publications.params),
    deletePublicationList: entity.deleteEntityList(publicationsService, 'deletePublicationList'),
};

export default publicationsController;
