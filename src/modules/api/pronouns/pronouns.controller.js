import controller from '../../../shared/controller.js';
import pronounsService from './pronouns.service.js';
import routesConstants from '../../../constant/routes.constants.js';

const pronounsController = {
    createPronouns: controller.create(pronounsService, 'createPronouns'),
    getPronounsList: controller.getList(pronounsService, 'getPronounsList'),
    getPronounsById: controller.getById(
        pronounsService,
        'getPronounsById',
        routesConstants.pronouns.params
    ),
    updatePronounsById: controller.updateById(
        pronounsService,
        'updatePronounsById',
        routesConstants.pronouns.params
    ),
    deletePronounsById: controller.deleteById(
        pronounsService,
        'deletePronounsById',
        routesConstants.pronouns.params
    ),
    deletePronounsList: controller.deleteList(
        pronounsService,
        'deletePronounsList'
    ),
};

export default pronounsController;
