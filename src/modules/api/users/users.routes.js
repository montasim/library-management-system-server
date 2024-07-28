import express from 'express';

import uploadMiddleware from '../../../middleware/upload.middleware.js';
import usersController from './users.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import usersValidator from './users.validator.js';
import usersBooksHistoryRoutes from './userBookHistory/usersBooksHistory.routes.js';
import userRequestBooksRoutes from './userRequestBooks/userRequestBooks.routes.js';
import recentlyVisitedBooksRoutes from './recentlyVisitedBooks/recentlyVisitedBooks.routes.js';

const router = express.Router();

router
    .route('/profile')
    .get(usersController.getUser)
    .put(
        uploadMiddleware.single('image'),
        usersValidator.updateUser,
        usersController.updateUser
    )
    .delete(usersValidator.deleteUser, usersController.deleteUser)
    .all(methodNotSupported);

router.use('/history', usersBooksHistoryRoutes);
router.use('/recently-visited', recentlyVisitedBooksRoutes);
router.use('/requested', userRequestBooksRoutes);

export default router;
