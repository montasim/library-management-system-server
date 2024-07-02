import express from 'express';

import writersController from './writers.controller.js';
import writersValidator from './writers.validator.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .post(writersValidator.createWriter, writersController.createWriter)
    .get(writersValidator.getWriters, writersController.getWriters)
    .delete(writersValidator.deleteWriters, writersController.deleteWriters)
    .all(methodNotSupported);

router
    .route('/:writerId')
    .get(writersValidator.getWriter, writersController.getWriter)
    .put(writersValidator.updateWriter, writersController.updateWriter)
    .delete(writersValidator.deleteWriter, writersController.deleteWriter)
    .all(methodNotSupported);

export default router;
