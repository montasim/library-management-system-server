import statusService from "./status.service.js";

const statusController = (req, res) => {
    const statusData = statusService(req);

    res.status(statusData.status).send(statusData);
};

export default statusController;