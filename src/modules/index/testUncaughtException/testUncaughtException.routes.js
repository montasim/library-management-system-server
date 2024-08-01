import express from 'express';

import testUncaughtExceptionController from './testUncaughtException.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(testUncaughtExceptionController)
    .all(methodNotSupported);

export default router;
