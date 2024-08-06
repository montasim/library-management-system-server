import userProfileService from './userProfile.service.js';
import controller from '../../../shared/controller.js';

const userProfileController = {
    getProfile: controller.getById(
        userProfileService,
        'getProfile',
        'username'
    ),
};

export default userProfileController;
