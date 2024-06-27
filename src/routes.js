import express from 'express';

import indexRoutes from './modules/index/index.routes.js';
import ApiRoutes from './modules/api/api.routes.js';
import undefinedController from './modules/undefined/undefined.controller.js';

const router = express.Router();

router.use('/', indexRoutes);
router.use('/api', ApiRoutes);
router.use('*', undefinedController);

export default router;
