import express from 'express';

import publicationsController from './publications.controller.js';
import publicationsValidator from './publications.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware,
        publicationsValidator.createPublication,
        publicationsController.createPublication
    )
    .get(
        publicationsValidator.getPublications,
        publicationsController.getPublications
    )
    .delete(
        authenticateMiddleware,
        publicationsValidator.deletePublications,
        publicationsController.deletePublications
    )
    .all(methodNotSupported);

router
    .route('/:publicationId')
    .get(
        publicationsValidator.getPublication,
        publicationsController.getPublication
    )
    .put(
        authenticateMiddleware,
        publicationsValidator.updatePublication,
        publicationsController.updatePublication
    )
    .delete(
        authenticateMiddleware,
        publicationsValidator.deletePublication,
        publicationsController.deletePublication
    )
    .all(methodNotSupported);

export default router;
