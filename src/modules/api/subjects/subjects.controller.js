import asyncErrorHandler from '../../../utilities/asyncErrorHandler.js';
import subjectsService from './subjects.service.js';

const createSubject = asyncErrorHandler(async (req, res) => {
    const newSubjectData = await subjectsService.createSubject(req.body);

    newSubjectData.route = req.originalUrl;

    res.status(newSubjectData.status).send(newSubjectData);
});

const getSubjects = asyncErrorHandler(async (req, res) => {
    const subjectsData = await subjectsService.getSubjects(req.query);

    subjectsData.route = req.originalUrl;

    res.status(subjectsData.status).send(subjectsData);
});

const getSubject = asyncErrorHandler(async (req, res) => {
    const subjectData = await subjectsService.getSubject(req.params.subjectId);

    subjectData.route = req.originalUrl;

    res.status(subjectData.status).send(subjectData);
});

const updateSubject = asyncErrorHandler(async (req, res) => {
    const updatedSubjectData = await subjectsService.updateSubject(
        req.params.subjectId,
        req.body
    );

    updatedSubjectData.route = req.originalUrl;

    res.status(updatedSubjectData.status).send(updatedSubjectData);
});

const deleteSubjects = asyncErrorHandler(async (req, res) => {
    const subjectIds = req.query.ids.split(',');
    const deletedSubjectsData =
        await subjectsService.deleteSubjects(subjectIds);

    deletedSubjectsData.route = req.originalUrl;

    res.status(deletedSubjectsData.status).send(deletedSubjectsData);
});

const deleteSubject = asyncErrorHandler(async (req, res) => {
    const deletedSubjectData = await subjectsService.deleteSubject(
        req.params.subjectId
    );

    deletedSubjectData.route = req.originalUrl;

    res.status(deletedSubjectData.status).send(deletedSubjectData);
});

const subjectsController = {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsController;
