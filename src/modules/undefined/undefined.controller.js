import asyncErrorHandler from '../../utilities/asyncErrorHandler.js';
import undefinedService from './undefined.service.js';

const undefinedController = asyncErrorHandler((req, res) => {
    const undefinedData = undefinedService(req);

    res.status(undefinedData.status).send(undefinedData);
});

export default undefinedController;
