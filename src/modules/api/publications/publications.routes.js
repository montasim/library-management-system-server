import express from 'express';

import publicationsController from './publications.controller.js';
import publicationsValidator from './publications.validator.js';
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
            routesConstants.publications.permissions.create
        ),
        publicationsValidator.createPublication,
        publicationsController.createPublication,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .get(
        publicationsValidator.getPublicationList,
        publicationsController.getPublicationList,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.deleteByList
        ),
        publicationsValidator.deletePublicationList,
        publicationsController.deletePublicationList,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.publications.params}`)
    .get(
        publicationsValidator.getPublicationById,
        publicationsController.getPublicationById,
        cacheMiddleware.create(configuration.cache.timeout)
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.updateById
        ),
        publicationsValidator.updatePublicationById,
        publicationsController.updatePublicationById,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.publications.permissions.deleteById
        ),
        publicationsValidator.deletePublicationById,
        publicationsController.deletePublicationById,
        cacheMiddleware.invalidate(routesConstants.publications.routes)
    )
    .all(methodNotSupported);

export default router;
