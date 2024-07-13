import adminValidator from './admin.validator.js';
import adminController from './admin.controller.js';
import methodNotSupported from '../../../../shared/methodNotSupported.js';
import router from '../auth.routes.js';

router
    .route('/admin')
    .post(adminValidator.createAdmin, adminController.createAdmin)
    // .get(adminValidator.getAdmin, adminController.getAdmin)
    // .delete(adminValidator.deleteAdmin, adminController.deleteAdmin)
    .all(methodNotSupported);

// router
//     .route('/admin/verify/:token')
//     .get(adminValidator.verify, adminController.verify)
//     .all(methodNotSupported);
//
// router
//     .route('/admin/resend-verification/:id')
//     .get(adminValidator.resendVerification, adminController.resendVerification)
//     .all(methodNotSupported);
//
// router
//     .route('/admin/reset-password/:token')
//     .put(adminValidator.resetPassword, adminController.resetPassword)
//     .all(methodNotSupported);
//
// router
//     .route('/admin/:adminId')
//     .get(adminValidator.adminId, adminController.getAdminById)
//     .delete(adminValidator.adminId, adminController.deleteAdminById)
//     .all(methodNotSupported);
//
// router
//     .route('/admin/login')
//     .post(adminValidator.login, adminController.login)
//     .all(methodNotSupported);
//
// router.route('/admin/logout').get(adminController.logout).all(methodNotSupported);

export default router;
