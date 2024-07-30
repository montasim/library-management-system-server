import mongoose, { Schema } from 'mongoose';

import sharedSchema from '../../../shared/schema.js';

// TODO: modular schema definition

// Define the Email schema
const emailSchema = new Schema({
    email: sharedSchema.emailSchema,

    // Flag to indicate primary email
    isPrimaryEmail: sharedSchema.isPrimaryEmailSchema,

    // Verification status of the email
    isEmailVerified: sharedSchema.isEmailVerifiedSchema,

    // Token for email verification
    emailVerifyToken: sharedSchema.emailVerifyTokenSchema,

    // Expiry date for the email verification token
    emailVerifyTokenExpires: sharedSchema.emailVerifyTokenExpiresSchema,
});

// Define the Email schema
const mobileSchema = new Schema({
    mobile: sharedSchema.mobileSchema,

    // Flag to indicate primary mobile
    isPrimaryMobile: sharedSchema.isPrimaryMobileSchema,

    // Verification status of the mobile number
    isMobileVerified: sharedSchema.isMobileVerifiedSchema,

    // Token for mobile number verification
    mobileVerifyToken: sharedSchema.mobileVerifyTokenSchema,

    // Expiry date for the mobile verification token
    mobileVerifyTokenExpires: sharedSchema.mobileVerifyTokenExpiresSchema,
});

// Schema definition
const userSchema = new mongoose.Schema(
    {
        // System Information
        // TODO: auto increment the user id sequentially like user-1 user-2
        // Numeric field to hold the incrementing value
        numericId: sharedSchema.numericIdSchema,
        // String field to hold the full ID with prefix
        userId: sharedSchema.userIdSchema,
        // Core User Information
        name: sharedSchema.nameSchema,
        // TODO: validate unique username
        // TODO: suggest unique username when updating
        username: sharedSchema.usernameSchema,
        // TODO: when user sign up set a default image for user
        image: sharedSchema.imageSchema,
        dateOfBirth: sharedSchema.dateOfBirthSchema,
        bio: sharedSchema.bioSchema,
        // TODO: set default pronouns
        pronouns: sharedSchema.pronounsSchema,

        // Contact Information
        emails: [emailSchema],
        mobiles: [mobileSchema],
        address: sharedSchema.addressSchema,

        // Authentication and Security
        passwordHash: sharedSchema.passwordHashSchema,
        // TODO: roles will be one of RolesModel
        role: sharedSchema.roleSchema,
        twoFactorEnabled: sharedSchema.twoFactorEnabledSchema,
        twoFactorSecret: sharedSchema.twoFactorSecretSchema,
        mustChangePassword: sharedSchema.mustChangePasswordSchema,
        resetPasswordVerifyToken: sharedSchema.resetPasswordVerifyTokenSchema,
        resetPasswordVerifyTokenExpires:
            sharedSchema.resetPasswordVerifyTokenExpiresSchema,

        // Professional Information
        company: sharedSchema.companySchema,

        // Social and External Accounts
        url: sharedSchema.urlSchema,
        socialAccounts: {
            facebook: sharedSchema.facebookSchema,
            twitter: sharedSchema.twitterSchema,
            linkedIn: sharedSchema.linkedInSchema,
            github: sharedSchema.githubSchema,
        },
        externalOAuth: sharedSchema.externalOAuthSchema,

        // Login and Session Management
        login: sharedSchema.loginSchema,
        sessions: [sharedSchema.sessionsSchema],

        // Activity Tracking and Privacy
        activities: [sharedSchema.activitiesSchema],
        privacySettings: {
            // TODO: use VisibilityModel
            profileVisibility: sharedSchema.profileVisibilitySchema,
        },

        isActive: sharedSchema.isActiveSchema,
        // TODO: create a system to initialy create a new user
        createdBy: sharedSchema.createdByAdminSchema,
        // TODO: create a system to update user data with limited access
        // TODO: create a model to define what admin can update about the user
        updatedBy: sharedSchema.updatedByAdminSchema,
    },
    {
        timestamps: true,
        versionKey: false,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

// Custom validation to check the uniqueness of the email
userSchema.path('emails').validate(async function (emails) {
    const emailAddresses = emails.map((email) => email.email);
    const userCount = await mongoose.model('Users').countDocuments({
        'emails.email': { $in: emailAddresses },
        _id: { $ne: this._id }, // Exclude the current document from the check if it's an update
    });
    return !userCount; // If there are no users with these emails, the validation passes
}, 'Email already exists.');

userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const update = this.getUpdate();
    // Check for attempts to update any email field
    if (
        update.$set &&
        (update.$set['emails.$.email'] || update.$set['emails'])
    ) {
        throw new Error(
            'Email updates are not permitted after account creation.'
        );
    }

    next();
});

const UsersModel = mongoose.model('Users', userSchema);

export default UsersModel;
