import express from 'express';

import methodNotSupported from '../../../../../shared/methodNotSupported.js';
import userProfileController from '../userProfile/userProfile.controller.js';

const router = express.Router();

router.route('/activity')
    .get(userProfileController.getProfile)
    .all(methodNotSupported);

router.route('/security')
    .get(userProfileController.getProfile)
    .all(methodNotSupported);

export default router;
