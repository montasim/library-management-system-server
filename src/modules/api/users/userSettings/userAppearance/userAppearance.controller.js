import userAppearanceService from './userAppearance.service.js';
import entity from '../../../../../shared/entity.js';

const userAppearanceController = {
    getAppearance: entity.getEntityByRequester(
        userAppearanceService,
        'getAppearance'
    ),
    updateAppearance: entity.updateEntityByRequester(
        userAppearanceService,
        'updateAppearance'
    ),
};

export default userAppearanceController;
