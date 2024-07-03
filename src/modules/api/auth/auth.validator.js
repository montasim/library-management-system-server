import validateWithSchema from '../../../shared/validateWithSchema.js';
import authSchema from './auth.schema.js';

const signup = validateWithSchema(authSchema.signup, 'body');
const verify = validateWithSchema(authSchema.verify, 'params');
const resendVerification = validateWithSchema(authSchema.resendVerification, 'params');
const login = validateWithSchema(authSchema.login, 'body');
const resetPassword = validateWithSchema(authSchema.signup, 'body');
const logout = validateWithSchema(authSchema.signup, 'body');

const authValidator = {
    signup,
    verify,
    resendVerification,
    login,
    resetPassword,
    logout,
};

export default authValidator;