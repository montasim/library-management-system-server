import userAccountService from './userAccount.service.js';
import controller from '../../../../../shared/controller.js';

const userAccountController = {
    deleteAccount: controller.create(
        userAccountService,
        'deleteAccount'
    ),
};

export default userAccountController;
