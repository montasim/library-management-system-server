import express from 'express';

import uploadMiddleware from '../../../middleware/upload.middleware.js';
import usersController from './users.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import usersValidator from './users.validator.js';
import usersBooksHistoryRoutes
    from './userBookHistory/usersBooksHistory.routes.js';
import userRequestBooksRoutes
    from './userRequestBooks/userRequestBooks.routes.js';

const router = express.Router();

router
    .route('/profile')
    .get(usersController.getUser)
    .put(
        uploadMiddleware.single('image'),
        usersValidator.update,
        usersController.updateUser
    )
    .delete(usersController.deleteUser)
    .all(methodNotSupported);

router.use('/history', usersBooksHistoryRoutes);
router.use('/requested', userRequestBooksRoutes);

export default router;
