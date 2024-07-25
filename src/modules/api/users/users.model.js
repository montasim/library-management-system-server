import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import patterns from '../../../constant/patterns.constants.js';
import userConstants from './users.constants.js';

// Schema definition
const userSchema = new mongoose.Schema(
    {
        // System Information
        // TODO: auto increment the user id sequentially like user-1 user-2
        // Numeric field to hold the incrementing value
        numericId: {
            type: Number,
            unique: true,
            required: true,
            description: 'Numeric part of the unique identifier, incremented automatically.'
        },
        // String field to hold the full ID with prefix
        userId: {
            type: String,
            unique: true,
            required: true,
            description: 'User ID in the format user-X, where X is an auto-incremented number.'
        },
        // Core User Information
        name: {
            type: String,
            required: [true, 'Please enter your name to create your profile.'],
            minlength: [
                userConstants.lengths.NAME_MIN,
                `Name should be at least ${userConstants.lengths.NAME_MIN} characters.`,
            ],
            maxlength: [
                userConstants.lengths.NAME_MAX,
                `Name should not exceed ${userConstants.lengths.NAME_MAX} characters.`,
            ],
            description:
                'User’s full name; must meet minimum and maximum length requirements.',
        },
        // TODO: validate unique username
        // TODO: suggest unique username when updating
        username: {
            type: String,
            unique: [
                true,
                'The username you chose is already in use. Please try a different one.',
            ],
            match: [
                patterns.EMAIL,
                'Please enter a valid email address for your username.',
            ],
            minlength: [
                userConstants.lengths.EMAIL_MIN,
                `Username should be at least ${userConstants.lengths.EMAIL_MIN} characters.`,
            ],
            maxlength: [
                userConstants.lengths.EMAIL_MAX,
                `Username should not exceed ${userConstants.lengths.EMAIL_MAX} characters.`,
            ],
            description:
                'Username, must be unique and formatted as an email address.',
        },
        image: {
            fileId: {
                type: String,
                maxlength: [100, 'File ID should not exceed 100 characters.'],
                description:
                    'Identifier for an image file stored in a file system or external service.',
            },
            shareableLink: {
                type: String,
                maxlength: [
                    500,
                    'Shareable link should not exceed 500 characters.',
                ],
                description:
                    "URL link that allows others to access the user's image.",
            },
            downloadLink: {
                type: String,
                maxlength: [
                    500,
                    'Download link should not exceed 500 characters.',
                ],
                description: "URL link to directly download the user's image.",
            },
            description: 'Image file management for user profile.',
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Your date of birth is required.'],
            description:
                "The user's birth date, important for age-based access control.",
        },
        bio: {
            type: String,
            maxlength: [
                userConstants.lengths.BIO_MAX,
                `Bio should not exceed ${userConstants.lengths.BIO_MAX} characters.`,
            ],
            description:
                'A short description about the user, limited to a specified maximum length.',
        },
        // TODO: create PronounsModel
        pronouns: {
            type: Schema.Types.ObjectId,
            ref: 'PronounsModel',
            required: [true, 'Please select your pronouns.'],
            description:
                'Reference to an external Pronouns model, ensuring pronouns are selected from a predefined list.',
        },

        // Contact Information
        emails: [
            {
                type: String,
                required: [true, 'An email address is required.'],
                unique: true,
                match: [patterns.EMAIL, 'Please enter a valid email address.'],
                minlength: [
                    userConstants.lengths.EMAIL_MIN,
                    `Email should be at least ${userConstants.lengths.EMAIL_MIN} characters long.`,
                ],
                maxlength: [
                    userConstants.lengths.EMAIL_MAX,
                    `Email should not exceed ${userConstants.lengths.EMAIL_MAX} characters long.`,
                ],
                description:
                    "User's email, each validated for uniqueness and proper format.",
            },
        ],
        mobiles: [
            {
                type: String,
                unique: true,
                match: [patterns.MOBILE, 'Please enter a valid mobile number.'],
                minlength: [
                    userConstants.lengths.MOBILE_MIN,
                    `Mobile number should have at least ${userConstants.lengths.MOBILE_MIN} digits.`,
                ],
                maxlength: [
                    userConstants.lengths.MOBILE_MAX,
                    `Mobile number should not exceed ${userConstants.lengths.MOBILE_MAX} digits.`,
                ],
                description:
                    "User's mobile number, must be unique and properly formatted.",
            },
        ],

        // Authentication and Security
        passwordHash: {
            type: String,
            required: [true, 'A password is necessary to secure your account.'],
            description:
                'Stores the hashed password for secure authentication.',
        },
        // TODO: roles will be one of RolesModel
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
            description:
                "Defines the user's role within the application, restricting access based on role.",
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
            description:
                'Boolean flag to indicate if two-factor authentication is enabled for added security.',
        },
        twoFactorSecret: {
            type: String,
            description:
                'Secret key for two-factor authentication, used to generate tokens.',
        },
        mustChangePassword: {
            type: Boolean,
            default: false,
            description:
                'Flag to indicate if the user must change their password at next login for security reasons.',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
            description:
                'Flag to indicate whether the user’s email has been verified.',
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
            description:
                'Flag to indicate whether the user’s phone number has been verified.',
        },
        emailVerifyToken: {
            type: String,
            description: 'Token used for email verification process.',
        },
        emailVerifyTokenExpires: {
            type: Date,
            description:
                'Expiration date and time for the email verification token.',
        },
        phoneVerifyToken: {
            type: String,
            description: 'Token used for phone number verification process.',
        },
        phoneVerifyTokenExpires: {
            type: Date,
            description:
                'Expiration date and time for the phone verification token.',
        },
        resetPasswordVerifyToken: {
            type: String,
            description:
                'Token used to verify the user’s identity for password reset process.',
        },
        resetPasswordVerifyTokenExpires: {
            type: Date,
            description:
                'Expiration date and time for the reset password verification token.',
        },

        // Professional Information
        company: {
            name: {
                type: String,
                minlength: [
                    userConstants.lengths.NAME_MIN,
                    `Company name should be at least ${userConstants.lengths.NAME_MIN} characters.`,
                ],
                maxlength: [
                    userConstants.lengths.NAME_MAX,
                    `Company name should not exceed ${userConstants.lengths.NAME_MAX} characters.`,
                ],
                description:
                    'Optional field for storing the name of the user\'s employer, with validation on length.',
            },
            website: {
                type: String,
                unique: [true, 'This URL is already in use.'],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your URL must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
                description:
                    'A unique URL associated with the user, typically for a personal or professional website.',
            },
            facebook: {
                type: String,
                unique: [
                    true,
                    'This Facebook URL is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your Facebook URL must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
            twitter: {
                type: String,
                unique: [
                    true,
                    'This Twitter handle is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your Twitter handle must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
            linkedIn: {
                type: String,
                unique: [
                    true,
                    'This LinkedIn profile is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your LinkedIn URL must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
            github: {
                type: String,
                unique: [
                    true,
                    'This GitHub username is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your GitHub username must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
        },

        // Social and External Accounts
        portfolio: {
            type: String,
            unique: [true, 'This URL is already in use.'],
            maxlength: [
                userConstants.lengths.URL_MAX,
                'Your URL must be less than ${userConstants.lengths.URL_MAX} characters long.',
            ],
            description:
                'A unique URL associated with the user, typically for a personal or professional website.',
        },
        socialAccounts: {
            facebook: {
                type: String,
                unique: [
                    true,
                    'This Facebook URL is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your Facebook URL must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
            twitter: {
                type: String,
                unique: [
                    true,
                    'This Twitter handle is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your Twitter handle must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
            linkedIn: {
                type: String,
                unique: [
                    true,
                    'This LinkedIn profile is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your LinkedIn URL must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
            github: {
                type: String,
                unique: [
                    true,
                    'This GitHub username is already linked to another account.',
                ],
                maxlength: [
                    userConstants.lengths.URL_MAX,
                    'Your GitHub username must be less than ${userConstants.lengths.URL_MAX} characters long.',
                ],
            },
            description:
                "Social media accounts linked to the user's profile, each requiring uniqueness.",
        },
        externalOAuth: {
            googleId: {
                type: String,
                unique: [true, 'This Google account is already registered.'],
                maxlength: [
                    100,
                    'The Google ID must be less than 100 characters.',
                ],
            },
            facebookId: {
                type: String,
                unique: [true, 'This Facebook account is already registered.'],
                maxlength: [
                    100,
                    'The Facebook ID must be less than 100 characters.',
                ],
            },
            twitterId: {
                type: String,
                unique: [true, 'This Twitter account is already registered.'],
                maxlength: [
                    100,
                    'The Twitter ID must be less than 100 characters.',
                ],
            },
            linkedInId: {
                type: String,
                unique: [true, 'This LinkedIn account is already registered.'],
                maxlength: [
                    100,
                    'The LinkedIn ID must be less than 100 characters.',
                ],
            },
            githubId: {
                type: String,
                unique: [true, 'This GitHub account is already registered.'],
                maxlength: [
                    100,
                    'The GitHub ID must be less than 100 characters.',
                ],
            },
            description:
                'Stores OAuth identifiers from external services like Google, Facebook, etc., used for integrating external login methods.',
        },

        // Login and Session Management
        login: {
            failed: {
                device: [
                    {
                        details: String,
                        dateTime: Date,
                        description:
                            'Records the details of failed login attempts including the device used and the time of attempt.',
                    },
                ],
            },
            successful: {
                device: [
                    {
                        details: String,
                        dateTime: Date,
                        description:
                            'Records successful login attempts for security audits and user analytics.',
                    },
                ],
            },
            description:
                'Manages records of login attempts, both failed and successful, for security and auditing.',
        },
        sessions: [
            {
                token: {
                    type: String,
                    required: [
                        true,
                        'A session token is necessary for maintaining session security.',
                    ],
                    description:
                        'Session token to manage user sessions securely.',
                },
                expiresAt: {
                    type: Date,
                    required: [
                        true,
                        'The expiration date for the session token is required.',
                    ],
                    description:
                        'Expiry date for the session token to ensure sessions are not indefinitely valid.',
                },
            },
        ],

        // Activity Tracking and Privacy
        activities: [
            {
                action: String,
                date: { type: Date, default: Date.now },
                metadata: Schema.Types.Mixed,
                description:
                    'Tracks user activities for analytics and monitoring.',
            },
        ],
        privacySettings: {
            profileVisibility: {
                type: String,
                enum: ['public', 'private', 'friends'],
                default: 'public',
                description:
                    'Controls the visibility of the user profile to other users.',
            },
            description:
                'Manages user-specific privacy settings, including profile visibility options.',
        },

        isActive: {
            type: Boolean,
            default: true,
            description:
                'Flag to indicate whether the user’s account is active or deactivated.',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
            description:
                'Reference to the user who created this record, used for tracking record ownership.',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'UsersModel',
            description:
                'Reference to the user who last updated this record, used for tracking changes and record ownership.',
        },
    },
    {
        timestamps: true,
        description:
            'Schema for storing user data with automatic timestamping for creation and updates.',
    }
);

// Middleware to prevent email updates
userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.email) {
        throw new Error(
            'Email updates are not permitted after account creation.'
        );
    }
    next();
});

const UsersModel = mongoose.model('Users', userSchema);

export default UsersModel;
