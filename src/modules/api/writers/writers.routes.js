import express from 'express';

import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import writersValidator from './writers.validator.js';
import cacheMiddleware from '../../../middleware/cache.middleware.js';
import configuration from '../../../configuration/configuration.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import writersController from './writers.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(routesConstants.writers.permissions.create),
        writersValidator.createWriter,
        uploadMiddleware.single('image'),
        cacheMiddleware.invalidate('writers'),
        writersController.createWriter
    )
    .get(
        writersValidator.getWriters,
        cacheMiddleware.create(configuration.cache.timeout),
        writersController.getWriters
    )
    .delete(
        authenticateMiddleware(
            routesConstants.writers.permissions.deleteByList
        ),
        writersValidator.deleteWriters,
        cacheMiddleware.invalidate('writers'),
        writersController.deleteWriters
    )
    .all(methodNotSupported);

router
    .route(`/${routesConstants.writers.params}`)
    .get(
        writersValidator.getWriter,
        cacheMiddleware.create(configuration.cache.timeout),
        writersController.getWriter
    )
    .put(
        authenticateMiddleware(routesConstants.writers.permissions.updateById),
        writersValidator.updateWriter,
        uploadMiddleware.single('image'),
        cacheMiddleware.invalidate('writers'),
        writersController.updateWriter
    )
    .delete(
        authenticateMiddleware(routesConstants.writers.permissions.deleteById),
        writersValidator.deleteWriter,
        cacheMiddleware.invalidate('writers'),
        writersController.deleteWriter
    )
    .all(methodNotSupported);

export default router;
