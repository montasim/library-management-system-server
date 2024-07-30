import express from 'express';

import userLogController from './userLog.controller.js';
import methodNotSupported from '../../../../../shared/methodNotSupported.js';

const router = express.Router();

router
    .route('/account')
    .get(userLogController.getAccountLog)
    .all(methodNotSupported);

router
    .route('/security')
    .get(userLogController.getSecurityLog)
    .all(methodNotSupported);

router
    .route('/security')
    .get(userLogController.getSecurityLog)
    .all(methodNotSupported);

export default router;
