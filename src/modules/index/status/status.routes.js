import express from 'express';

import statusController from './status.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(statusController)
    .all(methodNotSupported);

export default router;
