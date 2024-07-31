import adminSchema from './admin.schema.js';
import validateWithSchema from '../../../shared/validateWithSchema.js';

const createNewAdmin = validateWithSchema([
    {
        schema: adminSchema.createNewAdmin,
        property: 'body',
    },
]);

const verifyAdmin = validateWithSchema([
    {
        schema: adminSchema.verifyAdmin,
        property: 'params',
    },
]);

const resendAdminVerification = validateWithSchema([
    {
        schema: adminSchema.resendAdminVerification,
        property: 'params',
    },
]);

const adminLogin = validateWithSchema([
    {
        schema: adminSchema.login,
        property: 'body',
    },
]);

const requestNewAdminPassword = validateWithSchema([
    {
        schema: adminSchema.requestNewAdminPassword,
        property: 'body',
    },
]);

const resetAdminPassword = validateWithSchema([
    {
        schema: adminSchema.resetAdminPassword,
        property: 'body',
    },
]);

const adminValidator = {
    createNewAdmin,
    verifyAdmin,
    resendAdminVerification,
    adminLogin,
    requestNewAdminPassword,
    resetAdminPassword,
};

export default adminValidator;
