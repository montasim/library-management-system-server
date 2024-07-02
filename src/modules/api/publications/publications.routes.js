import express from 'express';

import publicationsController from './publications.controller.js';
import publicationsValidator from './publications.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(
        publicationsValidator.createPublication,
        publicationsController.createPublication
    )
    .get(
        publicationsValidator.getPublications,
        publicationsController.getPublications
    )
    .delete(
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
        publicationsValidator.updatePublication,
        publicationsController.updatePublication
    )
    .delete(
        publicationsValidator.deletePublication,
        publicationsController.deletePublication
    )
    .all(methodNotSupported);

export default router;
