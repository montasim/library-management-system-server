import express from 'express';

import writersValidator from './writers.validator.js';
import uploadMiddleware from '../../../middleware/upload.middleware.js';
import writersController from './writers.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(
        writersValidator.createWriter,
        uploadMiddleware.single('image'),
        writersController.createWriter
    )
    .get(writersValidator.getWriters, writersController.getWriters)
    .delete(writersValidator.deleteWriters, writersController.deleteWriters)
    .all(methodNotSupported);

router
    .route('/:writerId')
    .get(writersValidator.getWriter, writersController.getWriter)
    .put(
        writersValidator.updateWriter,
        uploadMiddleware.single('image'),
        writersController.updateWriter
    )
    .delete(writersValidator.deleteWriter, writersController.deleteWriter)
    .all(methodNotSupported);

export default router;
