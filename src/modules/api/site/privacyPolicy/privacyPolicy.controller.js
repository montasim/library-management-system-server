import privacyPolicyService from './privacyPolicy.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const privacyPolicyController = {
    createPrivacyPolicy: controller.create(privacyPolicyService, 'createPrivacyPolicy'),
    getPrivacyPolicy: controller.getList(privacyPolicyService, 'getPrivacyPolicy'),
    updatePrivacyPolicy: controller.updateById(
        privacyPolicyService,
        'updatePrivacyPolicy',
        routesConstants.privacyPolicy.params
    ),
    deletePrivacyPolicy: controller.deleteAll(privacyPolicyService, 'deletePrivacyPolicy'),
};

export default privacyPolicyController;
