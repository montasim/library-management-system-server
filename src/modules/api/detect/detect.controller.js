import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import detectService from './detect.service.js';

// TODO: use controller for controller
const detectController = asyncErrorHandlerService(async (req, res) => {
    const browserData = await detectService(req);

    browserData.route = req.originalUrl;

    res.status(browserData.status).send(browserData);
});

export default detectController;
