import termsAndConditionsService from './termsAndConditions.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const termsAndConditionsController = {
    createTermsAndConditions: controller.create(termsAndConditionsService, 'createTermsAndConditions'),
    getTermsAndConditions: controller.getList(termsAndConditionsService, 'getTermsAndConditions'),
    updateTermsAndConditions: controller.updateById(
        termsAndConditionsService,
        'updateTermsAndConditions',
        routesConstants.termsAndConditions.params
    ),
    deleteTermsAndConditions: controller.deleteAll(termsAndConditionsService, 'deleteTermsAndConditions'),
};

export default termsAndConditionsController;
