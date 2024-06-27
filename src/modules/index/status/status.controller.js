import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import statusService from './status.service.js';

const statusController = asyncErrorHandler((req, res) => {
    const statusData = statusService(req);

    res.status(statusData.status).send(statusData);
});

export default statusController;
