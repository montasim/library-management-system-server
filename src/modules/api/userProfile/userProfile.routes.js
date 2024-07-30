import express from 'express';

import methodNotSupported from '../../../shared/methodNotSupported.js';
import userProfileController from './userProfile.controller.js';

const router = express.Router();

router
    .route('/:username')
    .get(userProfileController.getProfile)
    .all(methodNotSupported);

export default router;
