import userProfileService from './getProfile.service.js';
import controller from '../../../../../shared/controller.js';

const userProfileController = {
    getProfile: controller.updateByRequester(
        userProfileService,
        'getProfile'
    ),
    updateProfile: controller.updateByRequester(
        userProfileService,
        'updateProfile'
    ),
};

export default userProfileController;
