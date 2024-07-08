import express from 'express';

import homeController from './home.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/')
    .get(homeController)
    .all(methodNotSupported);

export default router;
