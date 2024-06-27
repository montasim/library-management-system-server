import undefinedService from './undefined.service.js';

const undefinedController = (req, res) => {
    const undefinedData = undefinedService(req);

    res.status(undefinedData.status).send(undefinedData);
};

export default undefinedController;
