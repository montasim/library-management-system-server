import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import usersService from './users.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const getUser = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userData = await usersService.getUser(requester);

    userData.route = req.originalUrl;

    res.status(userData.status).send(userData);
});

const updateUser = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const userImage = req.file;
    const updatedUserData = await usersService.updateUser(
        requester,
        req.body,
        userImage
    );

    updatedUserData.route = req.originalUrl;

    res.status(updatedUserData.status).send(updatedUserData);
});

const deleteUser = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedUserData = await usersService.deleteUser(
        requester,
        req.body,
    );

    deletedUserData.route = req.originalUrl;

    res.status(deletedUserData.status).send(deletedUserData);
});

const usersController = {
    getUser,
    updateUser,
    deleteUser,
};

export default usersController;
