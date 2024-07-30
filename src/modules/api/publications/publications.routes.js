import express from 'express';

import publicationsController from './publications.controller.js';
import publicationsValidator from './publications.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import routesConstants from '../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware.admin,
        publicationsValidator.createPublication,
        publicationsController.createPublication
    )
    .get(
        publicationsValidator.getPublicationList,
        publicationsController.getPublicationList
    )
    .delete(
        authenticateMiddleware.admin,
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
        authenticateMiddleware.admin,
        publicationsValidator.updatePublicationById,
        publicationsController.updatePublicationById
    )
    .delete(
        authenticateMiddleware.admin,
        publicationsValidator.deletePublicationById,
        publicationsController.deletePublicationById
    )
    .all(methodNotSupported);

export default router;
