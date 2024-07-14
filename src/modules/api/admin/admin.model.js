import mongoose, { Schema } from 'mongoose';

import adminConstants from './admin.constants.js';
import patterns from '../../../constant/patterns.constants.js';

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
        image: {
            fileId: {
                type: String,
                maxlength: [
                    100,
                    'Picture fileId must be less than 100 characters long',
                ],
            },
            shareableLink: {
                type: String,
                maxlength: [
                    500,
                    'Picture shareableLink must be less than 500 characters long',
                ],
            },
            downloadLink: {
                type: String,
                maxlength: [
                    500,
                    'Picture downloadLink must be less than 500 characters long',
                ],
            },
        },
        email: {
            type: String,
            unique: [true, 'email address already taken'],
            required: [true, 'Please add the email address.'],
            match: [patterns.EMAIL, 'Please fill a valid email address'],
            minlength: [
                adminConstants.lengths.EMAIL_MIN,
                `email must be less than ${adminConstants.lengths.EMAIL_MIN} characters long`,
            ],
            maxlength: [
                adminConstants.lengths.EMAIL_MAX,
                `email must be less than ${adminConstants.lengths.EMAIL_MAX} characters long`,
            ],
        },
        mobile: {
            type: String,
            unique: true,
            sparse: true, // The index will only be applied to documents with non-null values for mobile
            match: [
                patterns.MOBILE,
                'Please enter a valid Bangladeshi mobile number',
            ],
            minlength: [
                adminConstants.lengths.MOBILE_MIN,
                `mobile number must be at least ${adminConstants.lengths.MOBILE_MIN} digits long`,
            ],
            maxlength: [
                adminConstants.lengths.MOBILE_MAX,
                `mobile number must be less than ${adminConstants.lengths.MOBILE_MAX} digits long`,
            ],
        },
        address: {
            type: String,
            minlength: [
                adminConstants.lengths.ADDRESS_MIN,
                `address must be at least ${adminConstants.lengths.ADDRESS_MIN} characters long`,
            ],
            maxlength: [
                adminConstants.lengths.ADDRESS_MAX,
                `address must be less than ${adminConstants.lengths.ADDRESS_MAX} characters long`,
            ],
        },
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
        password: {
            type: String,
        },
        mustChangePassword: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        emailVerifyToken: String,
        emailVerifyTokenExpires: Date,
        phoneVerifyToken: String,
        phoneVerifyTokenExpires: Date,
        resetPasswordVerifyToken: String,
        resetPasswordVerifyTokenExpires: Date,
        login: {
            failed: {
                device: [
                    {
                        details: String, // If you just need to store the user agent string
                        dateTime: Date,
                    },
                ],
            },
            successful: {
                device: [
                    {
                        details: String, // If you just need to store the user agent string
                        dateTime: Date,
                    },
                ],
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            trim: true,
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
        },
        updatedBy: {
            trim: true,
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
        },
    },
    {
        timestamps: true,
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
