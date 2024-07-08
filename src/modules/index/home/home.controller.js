import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import homeService from './home.service.js';

const homeController = asyncErrorHandler(async (req, res) => {
    const homeData = await homeService(req.params.token);

    homeData.route = req.originalUrl;

    res.status(homeData.status).send(homeData);
});

export default homeController;
