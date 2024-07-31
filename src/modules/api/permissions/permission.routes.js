import express from 'express';

import permissionsValidator from './permissions.validator.js';
import permissionsController from './permissions.controller.js';
import methodNotSupported from '../../../shared/methodNotSupported.js';
import routesConstants from '../../../constant/routes.constants.js';
import authenticateMiddleware from '../../../middleware/authenticate.middleware.js';
import accessTypesConstants from '../../../constant/accessTypes.constants.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.create
        ),
        permissionsValidator.createPermission,
        permissionsController.createPermission
    )
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.getList
        ),
        permissionsValidator.getPermissionList,
        permissionsController.getPermissionList
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.deleteByList
        ),
        permissionsValidator.deletePermissionList,
        permissionsController.deletePermissionList
    )
    .all(methodNotSupported);

router
    .route('/default')
    .post(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.createDefault
        ),
        permissionsController.createDefaultPermissionList
    )
    .all(methodNotSupported);

router
    .route(`/:${routesConstants.permissions.params}`)
    .get(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.getById
        ),
        permissionsValidator.getPermissionById,
        permissionsController.getPermissionById
    )
    .put(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.updateById
        ),
        permissionsValidator.updatePermissionById,
        permissionsController.updatePermissionById
    )
    .delete(
        authenticateMiddleware(
            accessTypesConstants.ADMIN,
            routesConstants.permissions.permissions.deleteById
        ),
        permissionsValidator.deletePermissionById,
        permissionsController.deletePermissionById
    )
    .all(methodNotSupported);

export default router;
