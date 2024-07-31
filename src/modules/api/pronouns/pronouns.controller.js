import entity from '../../../shared/entity.js';
import pronounsService from './pronouns.service.js';
import routesConstants from '../../../constant/routes.constants.js';

const pronounsController = {
    createPronouns: entity.createEntity(pronounsService, 'createPronouns'),
    getPronounsList: entity.getEntityList(pronounsService, 'getPronounsList'),
    getPronounsById: entity.getEntityById(pronounsService, 'getPronounsById', routesConstants.pronouns.params),
    updatePronounsById: entity.updateEntityById(pronounsService, 'updatePronounsById', routesConstants.pronouns.params),
    deletePronounsById: entity.deleteEntityById(pronounsService, 'deletePronounsById', routesConstants.pronouns.params),
    deletePronounsList: entity.deleteEntityList(pronounsService, 'deletePronounsList'),
};

export default pronounsController;
