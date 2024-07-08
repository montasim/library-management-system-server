import validateWithSchema from '../../../shared/validateWithSchema.js';
import authSchema from './auth.schema.js';

const signup = validateWithSchema([
    {
        schema: authSchema.signup,
        property: 'body',
    },
]);

const verify = validateWithSchema([
    {
        schema: authSchema.verify,
        property: 'params',
    },
]);

const resendVerification = validateWithSchema([
    {
        schema: authSchema.resendVerification,
        property: 'params',
    },
]);

const login = validateWithSchema([
    {
        schema: authSchema.login,
        property: 'body',
    },
]);

const requestNewPassword = validateWithSchema([
    {
        schema: authSchema.requestNewPassword,
        property: 'body',
    },
]);

const resetPassword = validateWithSchema([
    {
        schema: authSchema.resetPassword,
        property: 'body',
    },
]);

const logout = validateWithSchema([
    {
        schema: authSchema.signup,
        property: 'body',
    },
]);

const authValidator = {
    signup,
    verify,
    resendVerification,
    login,
    requestNewPassword,
    resetPassword,
    logout,
};

export default authValidator;
