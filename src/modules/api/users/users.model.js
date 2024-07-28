import mongoose, { Schema } from 'mongoose';

import patterns from '../../../constant/patterns.constants.js';
import userConstants from './users.constants.js';
import constants from '../../../constant/constants.js';
import sharedSchema from '../../../shared/schema.js';

// TODO: modular schema definition

// Define the Email schema
const emailSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        sparse: true,
        unique: [
            true,
            'This email address is already in use. Please use a different email address.',
        ],
        required: [true, 'An email address is required to register.'],
        match: [
            patterns.EMAIL,
            'Invalid email format. Please enter a valid email address.',
        ],
        minlength: [
            constants.lengths.EMAIL_MIN,
            `Email should be at least ${constants.lengths.EMAIL_MIN} characters long.`,
        ],
        maxlength: [
            constants.lengths.EMAIL_MAX,
            `Email should not exceed ${constants.lengths.EMAIL_MAX} characters long.`,
        ],
        description:
            "User's email, each validated for uniqueness and proper format.",
    },

    // Flag to indicate primary email
    isPrimaryEmail: {
        type: Boolean,
        default: false,
        description:
            'Indicates if this is the primary email for the user. Only one email should be set as primary at any time.',
    },

    // Verification status of the email
    isEmailVerified: {
        type: Boolean,
        default: false,
        description:
            "Flag to indicate whether the user's email has been verified.",
    },

    // Token for email verification
    emailVerifyToken: {
        type: String,
        trim: true,
        description: 'Token used for email verification process.',
    },

    // Expiry date for the email verification token
    emailVerifyTokenExpires: {
        type: Date,
        trim: true,
        description:
            'Expiration date and time for the email verification token.',
    },
});

// Define the Email schema
const mobileSchema = new Schema({
    mobile: {
        type: String,
        trim: true,
        sparse: true,
        unique: [
            true,
            'This mobile number is already registered. Please use a different mobile number.',
        ],
        match: [
            patterns.MOBILE,
            'Invalid mobile number format. Please enter a valid mobile number.',
        ],
        minlength: [
            constants.lengths.MOBILE_MIN,
            `Mobile number should have at least ${constants.lengths.MOBILE_MIN} digits.`,
        ],
        maxlength: [
            constants.lengths.MOBILE_MAX,
            `Mobile number should not exceed ${constants.lengths.MOBILE_MAX} digits.`,
        ],
        description:
            'Users mobile number, must be unique and properly formatted.',
    },

    // Flag to indicate primary mobile
    isPrimaryMobile: {
        type: Boolean,
        default: false,
        description:
            'Indicates if this is the primary mobile for the user. Only one mobile should be set as primary at any time.',
    },

    // Verification status of the mobile number
    isMobileVerified: {
        type: Boolean,
        default: false,
        description:
            "Flag to indicate whether the user's mobile number has been verified.",
    },

    // Token for mobile number verification
    mobileVerifyToken: {
        type: String,
        trim: true,
        description: 'Token used for mobile number verification process.',
    },

    // Expiry date for the mobile verification token
    mobileVerifyTokenExpires: {
        type: Date,
        trim: true,
        description:
            'Expiration date and time for the mobile verification token.',
    },
});

// Schema definition
const userSchema = new mongoose.Schema(
    {
        // System Information
        // TODO: auto increment the user id sequentially like user-1 user-2
        // Numeric field to hold the incrementing value
        numericId: {
            type: Number,
            trim: true,
            sparse: true,
            unique: [
                true,
                'The numeric ID must be unique. Duplicate IDs are not allowed.',
            ],
            // required: [true, 'A numeric ID is required for each user.'],
            description:
                'Numeric part of the unique identifier, incremented automatically.',
        },
        // String field to hold the full ID with prefix
        userId: {
            type: String,
            trim: true,
            sparse: true,
            // required: [
            //     true,
            //     'A user ID is required and must be unique across all users.',
            // ],
            unique: [
                true,
                'The user ID must be unique. Duplicate user IDs are not allowed.',
            ],
            description:
                'User ID in the format user-X, where X is an auto-incremented number.',
        },
        // Core User Information
        name: sharedSchema.nameSchema,
        // TODO: validate unique username
        // TODO: suggest unique username when updating
        username: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            unique: [
                true,
                'The username you chose is already in use. Please try a different one.',
            ],
            match: [
                userConstants.pattern.USERNAME,
                'Please enter a valid email address for your username.',
            ],
            minlength: [
                constants.lengths.USERNAME_MIN,
                `Username should be at least ${constants.lengths.USERNAME_MIN} characters.`,
            ],
            maxlength: [
                constants.lengths.USERNAME_MAX,
                `Username should not exceed ${constants.lengths.USERNAME_MAX} characters.`,
            ],
            description:
                'Username, must be unique and formatted as an email address.',
        },
        // TODO: when user sign up set a default image for user
        image: sharedSchema.imageSchema,
        dateOfBirth: {
            type: Date,
            trim: true,
            required: [true, 'Your date of birth is required.'],
            match: [
                userConstants.pattern.DATE_OF_BIRTH,
                'Date of birth must be in the format DD-MM-YYYY and a valid date.',
            ],
            description:
                "The user's birth date, important for age-based access control.",
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [
                userConstants.lengths.BIO_MAX,
                `Bio should not exceed ${userConstants.lengths.BIO_MAX} characters.`,
            ],
            description:
                'A short description about the user, limited to a specified maximum length.',
        },
        // TODO: set default pronouns
        pronouns: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'Pronouns',
            default: undefined,
            description:
                'Reference to an external Pronouns model, ensuring pronouns are selected from a predefined list.',
        },

        // Contact Information
        emails: [emailSchema],
        mobiles: [mobileSchema],
        address: sharedSchema.addressSchema,

        // Authentication and Security
        passwordHash: {
            type: String,
            trim: true,
            required: [true, 'A password is necessary to secure your account.'],
            description:
                'Stores the hashed password for secure authentication.',
        },
        // TODO: roles will be one of RolesModel
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Roles',
            default: undefined,
            description:
                "Defines the user's role within the application by referencing the RoleModel, restricting access based on the role defined in the RoleModel.",
        },
        twoFactorEnabled: {
            type: Boolean,
            trim: true,
            default: false,
            description:
                'Boolean flag to indicate if two-factor authentication is enabled for added security.',
        },
        twoFactorSecret: {
            type: String,
            trim: true,
            description:
                'Secret key for two-factor authentication, used to generate tokens.',
        },
        mustChangePassword: {
            type: Boolean,
            trim: true,
            default: false,
            description:
                'Flag to indicate if the user must change their password at next login for security reasons.',
        },
        resetPasswordVerifyToken: {
            type: String,
            trim: true,
            description:
                "Token used to verify the user's identity for password reset process.",
        },
        resetPasswordVerifyTokenExpires: {
            type: Date,
            trim: true,
            description:
                ' Expiration date and time for the reset password verification token.',
        },

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
            profileVisibility: {
                type: String,
                trim: true,
                enum: ['public', 'private', 'friends'],
                default: 'public',
                description:
                    'Controls the visibility of the user profile to other users.',
            },
        },

        isActive: {
            type: Boolean,
            trim: true,
            default: true,
            description:
                "Flag to indicate whether the user's account is active or deactivated.",
        },
        // TODO: create a system to initialy create a new user
        createdBy: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'AdminsModel',
            description:
                'Reference to the admin who created this record, used for tracking record ownership.',
        },
        // TODO: create a system to update user data with limited access
        // TODO: create a model to define what admin can update about the user
        updatedBy: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'AdminsModel',
            description:
                'Reference to the admin who last updated this record, used for tracking changes and record ownership.',
        },
    },
    {
        timestamps: true,
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
