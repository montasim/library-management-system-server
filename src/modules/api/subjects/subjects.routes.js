import express from 'express';

import subjectsController from './subjects.controller.js';
import subjectsValidator from './subjects.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(subjectsValidator.createSubject, subjectsController.createSubject)
    .get(subjectsValidator.getSubjects, subjectsController.getSubjects)
    .delete(subjectsValidator.deleteSubjects, subjectsController.deleteSubjects)
    .all(methodNotSupported);

router
    .route('/:subjectId')
    .get(subjectsValidator.getSubject, subjectsController.getSubject)
    .put(subjectsValidator.updateSubject, subjectsController.updateSubject)
    .delete(subjectsValidator.deleteSubject, subjectsController.deleteSubject)
    .all(methodNotSupported);

export default router;
