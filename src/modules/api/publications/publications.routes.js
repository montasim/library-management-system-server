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
        publicationsValidator.getPublications,
        publicationsController.getPublications
    )
    .delete(
        authenticateMiddleware.admin,
        publicationsValidator.deletePublications,
        publicationsController.deletePublications
    )
    .all(methodNotSupported);

router
    .route(`/${routesConstants.publications.params}`)
    .get(
        publicationsValidator.getPublication,
        publicationsController.getPublication
    )
    .put(
        authenticateMiddleware.admin,
        publicationsValidator.updatePublication,
        publicationsController.updatePublication
    )
    .delete(
        authenticateMiddleware.admin,
        publicationsValidator.deletePublication,
        publicationsController.deletePublication
    )
    .all(methodNotSupported);

export default router;
