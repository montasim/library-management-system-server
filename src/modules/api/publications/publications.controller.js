import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import publicationsService from './publications.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createPublication = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const newPublicationData = await publicationsService.createPublication(
        requester,
        req.body
    );

    newPublicationData.route = req.originalUrl;

    res.status(newPublicationData.status).send(newPublicationData);
});

const getPublications = asyncErrorHandler(async (req, res) => {
    const publicationsData = await publicationsService.getPublications(
        req.query
    );

    publicationsData.route = req.originalUrl;

    res.status(publicationsData.status).send(publicationsData);
});

const getPublication = asyncErrorHandler(async (req, res) => {
    const publicationData = await publicationsService.getPublication(
        req.params.publicationId
    );

    publicationData.route = req.originalUrl;

    res.status(publicationData.status).send(publicationData);
});

const updatePublication = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedPublicationData = await publicationsService.updatePublication(
        requester,
        req.params.publicationId,
        req.body
    );

    updatedPublicationData.route = req.originalUrl;

    res.status(updatedPublicationData.status).send(updatedPublicationData);
});

const deletePublications = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const publicationIds = req.query.ids.split(',');
    const deletedPublicationsData =
        await publicationsService.deletePublications(requester, publicationIds);

    deletedPublicationsData.route = req.originalUrl;

    res.status(deletedPublicationsData.status).send(deletedPublicationsData);
});

const deletePublication = asyncErrorHandler(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedPublicationData = await publicationsService.deletePublication(
        requester,
        req.params.publicationId
    );

    deletedPublicationData.route = req.originalUrl;

    res.status(deletedPublicationData.status).send(deletedPublicationData);
});

const publicationsController = {
    createPublication,
    getPublications,
    getPublication,
    updatePublication,
    deletePublications,
    deletePublication,
};

export default publicationsController;
