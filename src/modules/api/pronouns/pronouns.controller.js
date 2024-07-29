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

const getPronounses = asyncErrorHandlerService(async (req, res) => {
    const pronounsData = await pronounsService.getPronounses(
        req.query // This should correctly pass the query parameters
    );

    pronounsData.route = req.originalUrl;

    res.status(pronounsData.status).send(pronounsData);
});

const getPronouns = asyncErrorHandlerService(async (req, res) => {
    const pronounsData = await pronounsService.getPronouns(
        req.params.pronounsId
    );

    pronounsData.route = req.originalUrl;

    res.status(pronounsData.status).send(pronounsData);
});

const updatePronouns = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedPronounsData = await pronounsService.updatePronouns(
        requester,
        req.params.pronounsId,
        req.body
    );

    updatedPronounsData.route = req.originalUrl;

    res.status(updatedPronounsData.status).send(updatedPronounsData);
});

const deletePronounses = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const pronounsIds = req.query.ids.split(',');
    const deletedPronounsData = await pronounsService.deletePronounses(
        requester,
        pronounsIds
    );

    deletedPronounsData.route = req.originalUrl;

    res.status(deletedPronounsData.status).send(deletedPronounsData);
});

const deletePronouns = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedPronounsData = await pronounsService.deletePronouns(
        requester,
        req.params.pronounsId
    );

    deletedPronounsData.route = req.originalUrl;

    res.status(deletedPronounsData.status).send(deletedPronounsData);
});

const pronounsController = {
    createPronouns,
    getPronounses,
    getPronouns,
    updatePronouns,
    deletePronounses,
    deletePronouns,
};

export default pronounsController;
