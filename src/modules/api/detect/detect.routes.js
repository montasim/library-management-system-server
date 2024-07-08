import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import detectController from './detect.controller.js';

const router = express.Router();

router.route('/').get(detectController).all(methodNotSupported);

export default router;
