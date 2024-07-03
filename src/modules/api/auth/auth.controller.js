import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import authService from './auth.service.js';

const signup = asyncErrorHandler(async (req, res) => {
    const newUserData = await authService.signup(req.body);

    newUserData.route = req.originalUrl;

    res.status(newUserData.status).send(newUserData);
});

const authController = {
    signup,
};

export default authController;
