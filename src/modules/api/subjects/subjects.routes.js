import express from 'express';

import subjectsController from './subjects.controller.js';
import subjectsValidator from './subjects.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.subjects.permissions.create),
        subjectsValidator.createSubject,
        subjectsController.createSubject
    )
    .get(subjectsValidator.getSubjects, subjectsController.getSubjects)
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.deleteByList
        ),
        subjectsValidator.deleteSubjects,
        subjectsController.deleteSubjects
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.subjects.params}`)
    .get(subjectsValidator.getSubjectById, subjectsController.getSubjectById)
    .put(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.subjects.permissions.updateById),
        subjectsValidator.updateSubject,
        subjectsController.updateSubject
    )
    .delete(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.subjects.permissions.deleteById),
        subjectsValidator.deleteSubject,
        subjectsController.deleteSubject
    )
    .all(methodNotSupported);

export default router;
