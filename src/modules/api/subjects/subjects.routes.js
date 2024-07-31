import express from 'express';

import subjectsController from './subjects.controller.js';
import subjectsValidator from './subjects.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(routesConstants.subjects.permissions.create),
        subjectsValidator.createSubject,
        subjectsController.createSubject
    )
    .get(subjectsValidator.getSubjects, subjectsController.getSubjects)
    .delete(
        authenticateMiddleware(routesConstants.subjects.permissions.deleteByList),
        subjectsValidator.deleteSubjects,
        subjectsController.deleteSubjects
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.subjects.params}`)
    .get(subjectsValidator.getSubjectById, subjectsController.getSubjectById)
    .put(
        authenticateMiddleware(routesConstants.subjects.permissions.updateById),
        subjectsValidator.updateSubject,
        subjectsController.updateSubject
    )
    .delete(
        authenticateMiddleware(routesConstants.subjects.permissions.deleteById),
        subjectsValidator.deleteSubject,
        subjectsController.deleteSubject
    )
    .all(methodNotSupported);

export default router;
