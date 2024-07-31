import authService from './auth.service.js';
import entity from '../../../shared/entity.js';

const authController = {
    signup: entity.signupEntity(authService, 'signup'),
    verify: entity.verifyEntity(authService, 'verify'),
    resendVerification: entity.resendVerificationEntity(authService, 'resendVerification'),
    requestNewPassword: entity.requestNewPasswordEntity(authService, 'requestNewPassword'),
    resetPassword: entity.resetPasswordEntity(authService, 'resetPassword'),
    login: entity.loginEntity(authService, 'login'),
    logout: entity.logoutEntity(authService, 'logout'),
};

export default authController;
