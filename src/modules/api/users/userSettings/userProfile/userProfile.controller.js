import userProfileService from './getProfile.service.js';
import entity from '../../../../../shared/entity.js';

const userProfileController = {
    getProfile: entity.updateEntityByRequester(
        userProfileService,
        'getProfile'
    ),
    updateProfile: entity.updateEntityByRequester(
        userProfileService,
        'updateProfile'
    ),
};

export default userProfileController;
