import userAccountService from './userAccount.service.js';
import entity from '../../../../../shared/entity.js';

const userAccountController = {
    deleteAccount: entity.createEntity(
        userAccountService,
        'deleteAccount'
    ),
};

export default userAccountController;
