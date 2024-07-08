import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import detectService from './detect.service.js';

const detectController = asyncErrorHandler(async (req, res) => {
    const browserData = await detectService(req);

    browserData.route = req.originalUrl;

    res.status(browserData.status).send(browserData);
});

export default detectController;
