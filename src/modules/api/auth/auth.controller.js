import authService from './auth.service.js';
import controller from '../../../shared/controller.js';

const authController = {
    signup: controller.signup(authService, 'signup'),
    verify: controller.verify(authService, 'verify'),
    resendVerification: controller.resendVerification(
        authService,
        'resendVerification'
    ),
    requestNewPassword: controller.requestNewPassword(
        authService,
        'requestNewPassword'
    ),
    resetPassword: controller.resetPassword(authService, 'resetPassword'),
    login: controller.login(authService, 'login'),
    logout: controller.logout(authService, 'logout'),
};

export default authController;
