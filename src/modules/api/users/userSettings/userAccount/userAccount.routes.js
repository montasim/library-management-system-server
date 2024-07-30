import express from 'express';

import methodNotSupported from '../../../../../shared/methodNotSupported.js';

const router = express.Router();

router.route('/activity').get(usersController.getUser).all(methodNotSupported);

router.route('/security').get(usersController.getUser).all(methodNotSupported);

export default router;