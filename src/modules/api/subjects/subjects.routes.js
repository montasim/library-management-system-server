import express from 'express';

import subjectsController from './subjects.controller.js';
import subjectsValidator from './subjects.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.create
        ),
        subjectsValidator.createSubject,
        subjectsController.createSubject,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .get(
        subjectsValidator.getSubjects,
        subjectsController.getSubjects,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.deleteByList
        ),
        subjectsValidator.deleteSubjects,
        subjectsController.deleteSubjects,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.subjects.params}`)
    .get(
        subjectsValidator.getSubjectById,
        subjectsController.getSubjectById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.updateById
        ),
        subjectsValidator.updateSubject,
        subjectsController.updateSubject,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.subjects.permissions.deleteById
        ),
        subjectsValidator.deleteSubject,
        subjectsController.deleteSubject,
        cacheMiddleware.invalidate(routesConstants.subjects.routes)
    )
    .all(methodNotSupported);

export default router;
