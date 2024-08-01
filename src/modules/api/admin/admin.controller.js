import adminService from './admin.service.js';
import entity from '../../../shared/entity.js';

const adminController = {
    createNewAdmin: entity.createNewUserEntity(adminService, 'createNewAdmin'),
    verifyAdmin: entity.verifyEntity(adminService, 'verifyAdmin'),
    resendAdminVerification: entity.resendVerificationEntity(
        adminService,
        'resendAdminVerification'
    ),
    requestNewAdminPassword: entity.requestNewPasswordEntity(
        adminService,
        'requestNewAdminPassword'
    ),
    resetAdminPassword: entity.resetPasswordEntity(
        adminService,
        'resetAdminPassword'
    ),
    adminLogin: entity.loginEntity(adminService, 'adminLogin'),
    adminLogout: entity.logoutEntity(adminService, 'adminLogout'),
};

export default adminController;
