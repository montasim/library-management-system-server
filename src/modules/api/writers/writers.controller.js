import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import writersService from './writers.service.js';

const createWriter = asyncErrorHandler(async (req, res) => {
    const newWriterData = await writersService.createWriter(req.body);

    newWriterData.route = req.originalUrl;

    res.status(newWriterData.status).send(newWriterData);
});

const getWriters = asyncErrorHandler(async (req, res) => {
    const writersData = await writersService.getWriters(req.query);

    writersData.route = req.originalUrl;

    res.status(writersData.status).send(writersData);
});

const getWriter = asyncErrorHandler(async (req, res) => {
    const writerData = await writersService.getWriter(req.params.writerId);

    writerData.route = req.originalUrl;

    res.status(writerData.status).send(writerData);
});

const updateWriter = asyncErrorHandler(async (req, res) => {
    const updatedWriterData = await writersService.updateWriter(
        req.params.writerId,
        req.body
    );

    updatedWriterData.route = req.originalUrl;

    res.status(updatedWriterData.status).send(updatedWriterData);
});

const deleteWriters = asyncErrorHandler(async (req, res) => {
    const writerIds = req.query.ids.split(',');
    const deletedWritersData = await writersService.deleteWriters(writerIds);

    deletedWritersData.route = req.originalUrl;

    res.status(deletedWritersData.status).send(deletedWritersData);
});

const deleteWriter = asyncErrorHandler(async (req, res) => {
    const deletedWriterData = await writersService.deleteWriter(
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
