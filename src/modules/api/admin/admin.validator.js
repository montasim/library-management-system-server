import adminSchema from './admin.schema.js';
import validateWithSchema from '../../../shared/validateWithSchema.js';

const createAdmin = validateWithSchema([
    {
        schema: adminSchema.createAdmin,
        property: 'body',
    },
]);

const getAdmin = validateWithSchema([
    {
        schema: adminSchema.getAdmin,
        property: 'params',
    },
]);

const deleteAdmin = validateWithSchema([
    {
        schema: adminSchema.deleteAdmin,
        property: 'params',
    },
]);

const verify = validateWithSchema([
    {
        schema: adminSchema.verify,
        property: 'params',
    },
]);

const resendVerification = validateWithSchema([
    {
        schema: adminSchema.resendVerification,
        property: 'params',
    },
]);

const adminId = validateWithSchema([
    {
        schema: adminSchema.getAdminById,
        property: 'params',
    },
]);

const login = validateWithSchema([
    {
        schema: adminSchema.login,
        property: 'body',
    },
]);

const requestNewPassword = validateWithSchema([
    {
        schema: adminSchema.requestNewPassword,
        property: 'body',
    },
]);

const resetPassword = validateWithSchema([
    {
        schema: adminSchema.resetPassword,
        property: 'body',
    },
]);

const logout = validateWithSchema([
    {
        schema: adminSchema.signup,
        property: 'body',
    },
]);

const adminValidator = {
    createAdmin,
    getAdmin,
    deleteAdmin,
    verify,
    resendVerification,
    adminId,
    login,
    requestNewPassword,
    resetPassword,
    logout,
};

export default adminValidator;
