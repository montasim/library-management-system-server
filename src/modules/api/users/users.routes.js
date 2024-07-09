import express from 'express';

import uploadMiddleware from '../../../middleware/upload.middleware.js';
import usersController from './users.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import usersValidator from './users.validator.js';

const router = express.Router();

router
    .route('/profile')
    .get(authenticateMiddleware, usersController.getUser)
    .put(
        authenticateMiddleware,
        uploadMiddleware.single('image'),
        usersValidator.update,
        usersController.updateUser
    )
    .delete(authenticateMiddleware, usersController.deleteUser)
    .all(methodNotSupported);

export default router;
