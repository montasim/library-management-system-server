import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import homeService from './home.service.js';

const homeController = asyncErrorHandlerService(async (req, res) => {
    const homeData = await homeService(req.params.token);

    homeData.route = req.originalUrl;

    res.status(homeData.status).send(homeData);
});

export default homeController;
