import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import publicationsService from './publications.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createPublication = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newPublicationData = await publicationsService.createPublication(
        requester,
        req.body
    );

    newPublicationData.route = req.originalUrl;

    res.status(newPublicationData.status).send(newPublicationData);
});

const getPublicationList = asyncErrorHandlerService(async (req, res) => {
    const publicationsData = await publicationsService.getPublicationList(
        req.query
    );

    publicationsData.route = req.originalUrl;

    res.status(publicationsData.status).send(publicationsData);
});

const getPublicationById = asyncErrorHandlerService(async (req, res) => {
    const publicationData = await publicationsService.getPublicationById(
        req.params.publicationId
    );

    publicationData.route = req.originalUrl;

    res.status(publicationData.status).send(publicationData);
});

const updatePublicationById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedPublicationData =
        await publicationsService.updatePublicationById(
            requester,
            req.params.publicationId,
            req.body
        );

    updatedPublicationData.route = req.originalUrl;

    res.status(updatedPublicationData.status).send(updatedPublicationData);
});

const deletePublicationList = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const publicationIds = req.query.ids.split(',');
    const deletedPublicationsData =
        await publicationsService.deletePublicationList(
            requester,
            publicationIds
        );

    deletedPublicationsData.route = req.originalUrl;

    res.status(deletedPublicationsData.status).send(deletedPublicationsData);
});

const deletePublicationById = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedPublicationData =
        await publicationsService.deletePublicationById(
            requester,
            req.params.publicationId
        );

    deletedPublicationData.route = req.originalUrl;

    res.status(deletedPublicationData.status).send(deletedPublicationData);
});

const publicationsController = {
    createPublication,
    getPublicationList,
    getPublicationById,
    updatePublicationById,
    deletePublicationList,
    deletePublicationById,
};

export default publicationsController;
