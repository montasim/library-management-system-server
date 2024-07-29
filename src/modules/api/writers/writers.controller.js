import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import writersService from './writers.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createWriter = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const writerImage = req.file;
    const newWriterData = await writersService.createWriter(
        requester,
        req.body,
        writerImage
    );

    newWriterData.route = req.originalUrl;

    res.status(newWriterData.status).send(newWriterData);
});

const getWriters = asyncErrorHandlerService(async (req, res) => {
    const writersData = await writersService.getWriters(req.query);

    writersData.route = req.originalUrl;

    res.status(writersData.status).send(writersData);
});

const getWriter = asyncErrorHandlerService(async (req, res) => {
    const writerData = await writersService.getWriter(req.params.writerId);

    writerData.route = req.originalUrl;

    res.status(writerData.status).send(writerData);
});

const updateWriter = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const writerImage = req.file;
    const updatedWriterData = await writersService.updateWriter(
        requester,
        req.params.writerId,
        req.body,
        writerImage
    );

    updatedWriterData.route = req.originalUrl;

    res.status(updatedWriterData.status).send(updatedWriterData);
});

const deleteWriters = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const writerIds = req.query.ids.split(',');
    const deletedWritersData = await writersService.deleteWriters(
        requester,
        writerIds
    );

    deletedWritersData.route = req.originalUrl;

    res.status(deletedWritersData.status).send(deletedWritersData);
});

const deleteWriter = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedWriterData = await writersService.deleteWriter(
        requester,
        req.params.writerId
    );

    deletedWriterData.route = req.originalUrl;

    res.status(deletedWriterData.status).send(deletedWriterData);
});

const writersController = {
    createWriter,
    getWriters,
    getWriter,
    updateWriter,
    deleteWriters,
    deleteWriter,
};

export default writersController;
