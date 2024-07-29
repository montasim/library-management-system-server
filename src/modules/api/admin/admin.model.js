import mongoose, { Schema } from 'mongoose';

import adminConstants from './admin.constants.js';
import sharedSchema from '../../../shared/schema.js';

// Schema definition
const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add the name'],
            minlength: [
                adminConstants.lengths.NAME_MIN,
                `name must be at least ${adminConstants.lengths.NAME_MIN} characters long`,
            ],
            maxlength: [
                adminConstants.lengths.NAME_MAX,
                `name must be less than ${adminConstants.lengths.NAME_MAX} characters long`,
            ],
        },
        // TODO: set default image fpr admin
        image: sharedSchema.imageSchema,
        email: sharedSchema.emailSchema,
        mobile: sharedSchema.mobileSchema,
        address: sharedSchema.addressSchema,
        department: {
            type: String,
            minlength: [
                adminConstants.lengths.DEPARTMENT_MIN,
                `department must be at least ${adminConstants.lengths.DEPARTMENT_MIN} characters long`,
            ],
            maxlength: [
                adminConstants.lengths.DEPARTMENT_MAX,
                `department must be less than ${adminConstants.lengths.DEPARTMENT_MAX} characters long`,
            ],
        },
        designation: {
            type: String,
            minlength: [
                adminConstants.lengths.DESIGNATION_MIN,
                `designation must be at least ${adminConstants.lengths.DESIGNATION_MIN} characters long`,
            ],
            maxlength: [
                adminConstants.lengths.DESIGNATION_MAX,
                `designation must be less than ${adminConstants.lengths.DESIGNATION_MAX} characters long`,
            ],
        },
        password: sharedSchema.passwordHashSchema,
        mustChangePassword: sharedSchema.mustChangePasswordSchema,
        isEmailVerified: sharedSchema.isEmailVerifiedSchema,
        isPhoneVerified: sharedSchema.isMobileVerifiedSchema,
        emailVerifyToken: sharedSchema.emailVerifyTokenSchema,
        emailVerifyTokenExpires: sharedSchema.emailVerifyTokenExpiresSchema,
        phoneVerifyToken: sharedSchema.mobileVerifyTokenSchema,
        phoneVerifyTokenExpires: sharedSchema.mobileVerifyTokenExpiresSchema,
        resetPasswordVerifyToken: sharedSchema.resetPasswordVerifyTokenSchema,
        resetPasswordVerifyTokenExpires:
            sharedSchema.resetPasswordVerifyTokenExpiresSchema,
        login: {
            failed: {
                device: [
                    {
                        details: String, // If you just need to store the admin agent string
                        dateTime: Date,
                    },
                ],
            },
            successful: {
                device: [
                    {
                        details: String, // If you just need to store the admin agent string
                        dateTime: Date,
                    },
                ],
            },
        },
        isActive: sharedSchema.isActiveSchema,
        createdBy: sharedSchema.createdByAdminSchema,
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        description:
            'Schema for storing admin data with automatic timestamping for creation and updates.',
    }
);

adminSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const update = this.getUpdate();

    if (update.$set && update.$set.email) {
        throw new Error('updating email is not allowed.');
    }

    next();
});

const AdminModel = mongoose.model('Admin', adminSchema);

export default AdminModel;
