import express from 'express';

import homeRoutes from './home/home.routes.js';
import statusRoutes from './status/status.routes.js';
import testUncaughtExceptionRoutes from './testUncaughtException/testUncaughtException.routes.js';

const router = express.Router();

router.use('/', homeRoutes);

router.use('/status', statusRoutes);

router.use('/test-uncaught-exception', testUncaughtExceptionRoutes);

export default router;
