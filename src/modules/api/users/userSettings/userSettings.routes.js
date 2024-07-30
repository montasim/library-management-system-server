import express from 'express';

import usersController from '../users.controller.js';
import uploadMiddleware from '../../../../middleware/upload.middleware.js';
import usersValidator from '../users.validator.js';
import userLogRoutes from './userLog/userLog.routes.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';

const router = express.Router();

// TODO: user profile management
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

router
    // TODO: user account management
    .route('/account')
    .get(usersController.getUser)
    .put(
        uploadMiddleware.single('image'),
        usersValidator.updateUser,
        usersController.updateUser
    )
    .delete(usersValidator.deleteUser, usersController.deleteUser)
    .all(methodNotSupported);

router
    // TODO: user appearance management, eg: theme, font size, etc
    .route('/appearance')
    .get(usersController.getUser)
    .put(
        uploadMiddleware.single('image'),
        usersValidator.updateUser,
        usersController.updateUser
    )
    .delete(usersValidator.deleteUser, usersController.deleteUser)
    .all(methodNotSupported);

router
    // TODO: user security management, eg: email, mobile, password, 2FA, etc
    .route('/security')
    .get(usersController.getUser)
    .put(
        uploadMiddleware.single('image'),
        usersValidator.updateUser,
        usersController.updateUser
    )
    .delete(usersValidator.deleteUser, usersController.deleteUser)
    .all(methodNotSupported);

// TODO: user log management, eg: security, activities
router.use('/log', userLogRoutes);

export default router;
