import mongoose, { Schema } from 'mongoose';

import patterns from '../../../constant/patterns.constants.js';
import userConstants from './users.constants.js';

// Schema definition
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add the name'],
            minlength: [
                userConstants.lengths.NAME_MIN,
                `name must be at least ${userConstants.lengths.NAME_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.NAME_MAX,
                `name must be less than ${userConstants.lengths.NAME_MAX} characters long`,
            ],
        },
        email: {
            type: String,
            unique: [true, 'email address already taken'],
            required: [true, 'Please add the email address.'],
            match: [patterns.EMAIL, 'Please fill a valid email address'],
            minlength: [
                userConstants.lengths.EMAIL_MIN,
                `email must be less than ${userConstants.lengths.EMAIL_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.EMAIL_MAX,
                `email must be less than ${userConstants.lengths.EMAIL_MAX} characters long`,
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
                userConstants.lengths.MOBILE_MIN,
                `mobile number must be at least ${userConstants.lengths.MOBILE_MIN} digits long`,
            ],
            maxlength: [
                userConstants.lengths.MOBILE_MAX,
                `mobile number must be less than ${userConstants.lengths.MOBILE_MAX} digits long`,
            ],
        },
        address: {
            type: String,
            minlength: [
                userConstants.lengths.ADDRESS_MIN,
                `address must be at least ${userConstants.lengths.ADDRESS_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.ADDRESS_MAX,
                `address must be less than ${userConstants.lengths.ADDRESS_MAX} characters long`,
            ],
        },
        department: {
            type: String,
            minlength: [
                userConstants.lengths.DEPARTMENT_MIN,
                `department must be at least ${userConstants.lengths.DEPARTMENT_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.DEPARTMENT_MAX,
                `department must be less than ${userConstants.lengths.DEPARTMENT_MAX} characters long`,
            ],
        },
        designation: {
            type: String,
            minlength: [
                userConstants.lengths.DESIGNATION_MIN,
                `designation must be at least ${userConstants.lengths.DESIGNATION_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.DESIGNATION_MAX,
                `designation must be less than ${userConstants.lengths.DESIGNATION_MAX} characters long`,
            ],
        },
        password: {
            type: String,
            required: [true, 'password is required'],
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

userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const update = this.getUpdate();

    if (update.$set && (update.$set.email || update.$set.mobile)) {
        throw new Error('updating email or mobile number is not allowed.');
    }

    next();
});

const UsersModel = mongoose.model('Users', userSchema);

export default UsersModel;
