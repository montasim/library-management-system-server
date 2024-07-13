import express from 'express';

import uploadMiddleware from '../../../middleware/upload.middleware.js';
import usersController from './users.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import usersValidator from './users.validator.js';
import usersBooksHistoryRoutes
    from './userBookHistory/usersBooksHistory.routes.js';

const router = express.Router();

router
    .route('/profile')
    .get(authenticateMiddleware.user, usersController.getUser)
    .put(
        authenticateMiddleware.user,
        uploadMiddleware.single('image'),
        usersValidator.update,
        usersController.updateUser
    )
    .delete(authenticateMiddleware.user, usersController.deleteUser)
    .all(methodNotSupported);

router.use('/history', authenticateMiddleware.user, usersBooksHistoryRoutes);

export default router;
