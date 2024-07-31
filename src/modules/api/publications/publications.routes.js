import express from 'express';

import publicationsController from './publications.controller.js';
import publicationsValidator from './publications.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(accessTypesConstants.ADMIN, routesConstants.publications.permissions.create),
        publicationsValidator.createPublication,
        publicationsController.createPublication
    )
    .get(
        publicationsValidator.getPublicationList,
        publicationsController.getPublicationList
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.deleteByList
        ),
        publicationsValidator.deletePublicationList,
        publicationsController.deletePublicationList
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.publications.params}`)
    .get(
        publicationsValidator.getPublicationById,
        publicationsController.getPublicationById
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.updateById
        ),
        publicationsValidator.updatePublicationById,
        publicationsController.updatePublicationById
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.deleteById
        ),
        publicationsValidator.deletePublicationById,
        publicationsController.deletePublicationById
    )
    .all(methodNotSupported);

export default router;
