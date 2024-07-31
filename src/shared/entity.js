import asyncErrorHandlerService from '../utilities/asyncErrorHandler.js';
import getRequesterId from '../utilities/getRequesterId.js';
import loggerService from '../service/logger.service.js';

// TODO: Implement the `entity` log

const createEntity = (service, createFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newData = await service[createFunction](requester, req.body);

    loggerService.info(`Entity created by ${requester} at ${req.originalUrl}`, newData);

    newData.route = req.originalUrl;
    res.status(newData.status).send(newData);
});

const getEntityList = (service, getListFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req) || null;

    // Determine the query to pass based on the presence of `requester`.
    const query = requester ? [requester, req.query] : [req.query];

    // Call the service function with the appropriate query.
    const dataList = await service[getListFunction](...query);

    loggerService.info(`Entity list retrieved for requester ${requester || 'anonymous'} at ${req.originalUrl}`);

    dataList.route = req.originalUrl;
    res.status(dataList.status).send(dataList);
});

const getEntityById = (service, getByIdFunction, paramsId) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);

    // Determine the parameters to pass based on the presence of `requester`.
    const params = requester ? [requester, req.params[paramsId]] : [req.params[paramsId]];

    // Call the service function with the appropriate parameters.
    const data = await service[getByIdFunction](...params);

    loggerService.info(`Details retrieved for entity ID ${req.params[paramsId]} by ${requester} at ${req.originalUrl}`);

    data.route = req.originalUrl;
    res.status(data.status).send(data);
});

const updateEntityById = (service, updateByIdFunction, paramsId) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedData = await service[updateByIdFunction](requester, req.params[paramsId], req.body);

    loggerService.info(`Entity ${req.params[paramsId]} updated by ${requester} at ${req.originalUrl}`);

    updatedData.route = req.originalUrl;
    res.status(updatedData.status).send(updatedData);
});

const deleteEntityById = (service, deleteByIdFunction, paramsId) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedData = await service[deleteByIdFunction](requester, req.params[paramsId]);

    loggerService.warn(`Entity ${req.params[paramsId]} deleted by ${requester} at ${req.originalUrl}`);

    deletedData.route = req.originalUrl;
    res.status(deletedData.status).send(deletedData);
});

const deleteEntityList = (service, deleteByIdFunction) => asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const ids = req.query.ids.split(',');
    const deletedListData = await service[deleteByIdFunction](requester, ids);

    loggerService.warn(`Multiple entities [${ids.join(', ')}] deleted by ${requester} at ${req.originalUrl}`);

    deletedListData.route = req.originalUrl;
    res.status(deletedListData.status).send(deletedListData);
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
