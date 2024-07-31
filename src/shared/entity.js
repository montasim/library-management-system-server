import asyncErrorHandlerService from '../utilities/asyncErrorHandler.js';
import getRequesterId from '../utilities/getRequesterId.js';

const createEntity = (service, createFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newData = await service[createFunction](requester, req.body);

    newData.route = req.originalUrl;
    res.status(newData.status).send(newData);
});

const getEntityList = (service, getListFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const data = await service[getListFunction](requester, req.query);

    data.route = req.originalUrl;
    res.status(data.status).send(data);
});

const getEntityById = (service, getByIdFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const data = await service[getByIdFunction](requester, req.params.id);

    data.route = req.originalUrl;
    res.status(data.status).send(data);
});

const updateEntityById = (service, updateByIdFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedData = await service[updateByIdFunction](requester, req.params.id, req.body);

    updatedData.route = req.originalUrl;
    res.status(updatedData.status).send(updatedData);
});

const deleteEntityById = (service, deleteByIdFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedData = await service[deleteByIdFunction](requester, req.params.id);

    deletedData.route = req.originalUrl;
    res.status(deletedData.status).send(deletedData);
});

const deleteEntityList = (service, deleteByIdFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const ids = req.query.ids.split(',');
    const deletedData = await service[deleteByIdFunction](requester, ids);

    deletedData.route = req.originalUrl;
    res.status(deletedData.status).send(deletedData);
});

const entity = {
    createEntity,
    getEntityList,
    getEntityById,
    updateEntityById,
    deleteEntityById,
    deleteEntityList,
}

export default entity;
