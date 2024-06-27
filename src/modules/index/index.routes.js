import express from 'express';

import statusRoutes from './status/status.routes.js';

const router = express.Router();

router.use('/status', statusRoutes);

export default router;
