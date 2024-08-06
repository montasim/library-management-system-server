import adminService from './admin.service.js';
import controller from '../../../shared/controller.js';

const adminController = {
    createNewAdmin: controller.createNewUser(adminService, 'createNewAdmin'),
    verifyAdmin: controller.verify(adminService, 'verifyAdmin'),
    resendAdminVerification: controller.resendVerification(
        adminService,
        'resendAdminVerification'
    ),
    requestNewAdminPassword: controller.requestNewPassword(
        adminService,
        'requestNewAdminPassword'
    ),
    resetAdminPassword: controller.resetPassword(
        adminService,
        'resetAdminPassword'
    ),
    adminLogin: controller.login(adminService, 'adminLogin'),
    adminLogout: controller.logout(adminService, 'adminLogout'),
};

export default adminController;
