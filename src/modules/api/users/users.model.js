import mongoose from 'mongoose';

import patterns from '../../../constant/patterns.constants.js';
import userConstants from './users.constants.js';

// Schema definition
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add the first name'],
            minlength: [
                userConstants.lengths.NAME_MIN,
                `First name must be at least ${userConstants.lengths.NAME_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.NAME_MAX,
                `First name must be less than ${userConstants.lengths.NAME_MAX} characters long`,
            ],
        },
        email: {
            type: String,
            unique: [true, 'Email address already taken'],
            required: [true, 'Please add the email address.'],
            match: [patterns.EMAIL, 'Please fill a valid email address'],
            minlength: [
                userConstants.lengths.EMAIL_MIN,
                `Email must be less than ${userConstants.lengths.EMAIL_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.EMAIL_MAX,
                `Email must be less than ${userConstants.lengths.EMAIL_MAX} characters long`,
            ],
        },
        mobile: {
            type: String,
            unique: [true, 'Mobile number already taken'],
            match: [
                patterns.MOBILE,
                'Please enter a valid Bangladeshi mobile number',
            ],
            minlength: [
                userConstants.lengths.MOBILE_MIN,
                `Mobile number must be at least ${userConstants.lengths.MOBILE_MIN} digits long`,
            ], // Including country code can extend the length
            maxlength: [
                userConstants.lengths.MOBILE_MAX,
                `Mobile number must be less than ${userConstants.lengths.MOBILE_MAX} digits long`,
            ], // Considering potential country code and formatting
        },
        address: {
            type: String,
            minlength: [
                userConstants.lengths.ADDRESS_MIN,
                `Address must be at least ${userConstants.lengths.ADDRESS_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.ADDRESS_MAX,
                `Address must be less than ${userConstants.lengths.ADDRESS_MAX} characters long`,
            ],
        },
        department: {
            type: String,
            minlength: [
                userConstants.lengths.DEPARTMENT_MIN,
                `Department must be at least ${userConstants.lengths.DEPARTMENT_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.DEPARTMENT_MAX,
                `Department must be less than ${userConstants.lengths.DEPARTMENT_MAX} characters long`,
            ],
        },
        designation: {
            type: String,
            minlength: [
                userConstants.lengths.DESIGNATION_MIN,
                `Designation must be at least ${userConstants.lengths.DESIGNATION_MIN} characters long`,
            ],
            maxlength: [
                userConstants.lengths.DESIGNATION_MAX,
                `Designation must be less than ${userConstants.lengths.DESIGNATION_MAX} characters long`,
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        mustChangePassword: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerifyToken: String,
        emailVerifyTokenExpires: Date,
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: String,
            trim: true,
            required: false,
        },
        updatedBy: {
            type: String,
            trim: true,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const update = this.getUpdate();

    if (update.$set && (update.$set.email || update.$set.mobile)) {
        throw new Error('Updating email or mobile number is not allowed.');
    }

    next();
});

const UsersModel = mongoose.model('Users', userSchema);

export default UsersModel;
