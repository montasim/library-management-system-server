import userAppearanceService from './userAppearance.service.js';
import controller from '../../../../../shared/controller.js';

const userAppearanceController = {
    getAppearance: controller.getByRequester(
        userAppearanceService,
        'getAppearance'
    ),
    updateAppearance: controller.updateByRequester(
        userAppearanceService,
        'updateAppearance'
    ),
};

export default userAppearanceController;
