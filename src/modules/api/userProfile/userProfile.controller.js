import userProfileService from './userProfile.service.js';
import entity from '../../../shared/entity.js';

const userProfileController = {
    getProfile: entity.getEntityById(
        userProfileService,
        'getProfile',
        'username'
    ),
};

export default userProfileController;
