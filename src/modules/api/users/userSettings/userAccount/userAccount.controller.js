import asyncErrorHandlerService
    from '../../../../../service/asyncErrorHandler.service.js';
import getRequesterId from '../../../../../utilities/getRequesterId.js';
import userAccountService from './userAccount.service.js';

const deleteAccount = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedUserData = await userAccountService.deleteAccount(requester, req.body);

    deletedUserData.route = req.originalUrl;

    res.status(deletedUserData.status).send(deletedUserData);
});

const userAccountController = {
    deleteAccount,
};

export default userAccountController;
