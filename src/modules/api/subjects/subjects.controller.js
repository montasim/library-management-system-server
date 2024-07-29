import asyncErrorHandlerService from '../../../service/asyncErrorHandler.service.js';
import subjectsService from './subjects.service.js';
import getRequesterId from '../../../utilities/getRequesterId.js';

const createSubject = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const newSubjectData = await subjectsService.createSubject(
        requester,
        req.body
    );

    newSubjectData.route = req.originalUrl;

    res.status(newSubjectData.status).send(newSubjectData);
});

const getSubjects = asyncErrorHandlerService(async (req, res) => {
    const subjectsData = await subjectsService.getSubjects(req.query);

    subjectsData.route = req.originalUrl;

    res.status(subjectsData.status).send(subjectsData);
});

const getSubjectById = asyncErrorHandlerService(async (req, res) => {
    const subjectData = await subjectsService.getSubjectById(req.params.subjectId);

    subjectData.route = req.originalUrl;

    res.status(subjectData.status).send(subjectData);
});

const updateSubject = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const updatedSubjectData = await subjectsService.updateSubject(
        requester,
        req.params.subjectId,
        req.body
    );

    updatedSubjectData.route = req.originalUrl;

    res.status(updatedSubjectData.status).send(updatedSubjectData);
});

const deleteSubjects = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const subjectIds = req.query.ids.split(',');
    const deletedSubjectsData = await subjectsService.deleteSubjects(
        requester,
        subjectIds
    );

    deletedSubjectsData.route = req.originalUrl;

    res.status(deletedSubjectsData.status).send(deletedSubjectsData);
});

const deleteSubject = asyncErrorHandlerService(async (req, res) => {
    const requester = getRequesterId(req);
    const deletedSubjectData = await subjectsService.deleteSubject(
        requester,
        req.params.subjectId
    );

    deletedSubjectData.route = req.originalUrl;

    res.status(deletedSubjectData.status).send(deletedSubjectData);
});

const subjectsController = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsController;
