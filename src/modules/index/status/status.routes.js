import express from 'express';

import statusController from './status.controller.js';

const router = express.Router();

router.get('/', statusController);

export default router;
