import validateWithSchema from '../../../shared/validateWithSchema.js';
import authSchema from './auth.schema.js';

const signup = validateWithSchema(authSchema.signup, 'body');
const login = validateWithSchema(authSchema.login, 'body');
const resetPassword = validateWithSchema(authSchema.signup, 'body');
const logout = validateWithSchema(authSchema.signup, 'body');

const authValidator = {
    signup,
    login,
    resetPassword,
    logout,
};

export default authValidator;
