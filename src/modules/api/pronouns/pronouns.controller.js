import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import pronounsService from './pronouns.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createPronouns = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newPronounsData = await pronounsService.createPronouns(
        requester,
        req.body
    );

    newPronounsData.route = req.originalUrl;

    res.status(newPronounsData.status).send(newPronounsData);
});

const getPronounsList = asyncErrorHandlerService(async (req, res) => {
    const pronounsData = await pronounsService.getPronounsList(
        req.query // This should correctly pass the query parameters
    );

    pronounsData.route = req.originalUrl;

    res.status(pronounsData.status).send(pronounsData);
});

const getPronounsById = asyncErrorHandlerService(async (req, res) => {
    const pronounsData = await pronounsService.getPronounsById(
        req.params.pronounsId
    );

    pronounsData.route = req.originalUrl;

    res.status(pronounsData.status).send(pronounsData);
});

const updatePronounsById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedPronounsData = await pronounsService.updatePronounsById(
        requester,
        req.params.pronounsId,
        req.body
    );

    updatedPronounsData.route = req.originalUrl;

    res.status(updatedPronounsData.status).send(updatedPronounsData);
});

const deletePronounsList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const pronounsIds = req.query.ids.split(',');
    const deletedPronounsData = await pronounsService.deletePronounsList(
        requester,
        pronounsIds
    );

    deletedPronounsData.route = req.originalUrl;

    res.status(deletedPronounsData.status).send(deletedPronounsData);
});

const deletePronounsById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedPronounsData = await pronounsService.deletePronounsById(
        requester,
        req.params.pronounsId
    );

    deletedPronounsData.route = req.originalUrl;

    res.status(deletedPronounsData.status).send(deletedPronounsData);
});

const pronounsController = {
    createPronouns,
    getPronounsList,
    getPronounsById,
    updatePronounsById,
    deletePronounsList,
    deletePronounsById,
};

export default pronounsController;
