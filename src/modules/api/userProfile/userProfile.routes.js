import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import userProfileController from './userProfile.controller.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';

const router = express.Router();

router
    .route('/:username')
    .get(authenticateMiddleware.user, userProfileController.getProfile)
    .all(methodNotSupported);

export default router;
