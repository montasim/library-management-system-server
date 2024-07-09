import express from 'express';

import subjectsController from './subjects.controller.js';
import subjectsValidator from './subjects.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware
    from '../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(authenticateMiddleware, subjectsValidator.createSubject, subjectsController.createSubject)
    .get(subjectsValidator.getSubjects, subjectsController.getSubjects)
    .delete(authenticateMiddleware, subjectsValidator.deleteSubjects, subjectsController.deleteSubjects)
    .all(methodNotSupported);

router
    .route('/:subjectId')
    .get(subjectsValidator.getSubject, subjectsController.getSubject)
    .put(authenticateMiddleware, subjectsValidator.updateSubject, subjectsController.updateSubject)
    .delete(authenticateMiddleware, subjectsValidator.deleteSubject, subjectsController.deleteSubject)
    .all(methodNotSupported);

export default router;
