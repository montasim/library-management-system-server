import mongoose, { Schema } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import patterns from '../../../constant/patterns.constants.js';
import userConstants from './users.constants.js';
import constants from '../../../constant/constants.js';

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
            unique: [true, 'The numeric ID must be unique. Duplicate IDs are not allowed.'],
            required: [true, 'A numeric ID is required for each user.'],
            description: 'Numeric part of the unique identifier, incremented automatically.',
        },
        // String field to hold the full ID with prefix
        userId: {
            type: String,
            trim: true,
            sparse: true,
            required: [true, 'A user ID is required and must be unique across all users.'],
            unique: [true, 'The user ID must be unique. Duplicate user IDs are not allowed.'],
            description: 'User ID in the format user-X, where X is an auto-incremented number.',
        },
        // Core User Information
        name: {
            first: {
                type: String,
                trim: true,
                required: [
                    true,
                    'Please enter your name to create your profile.',
                ],
                match: [
                    userConstants.pattern.NAME,
                    'Invalid name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".'
                ],
                minlength: [
                    userConstants.lengths.NAME.FIRST_MIN,
                    `Name should be at least ${userConstants.lengths.NAME.FIRST_MIN} characters.`,
                ],
                maxlength: [
                    userConstants.lengths.NAME.FIRST_MAX,
                    `Name should not exceed ${userConstants.lengths.NAME.FIRST_MAX} characters.`,
                ],
                description:
                    'User’s name; must meet minimum and maximum length requirements.',
            },
            middle: {
                type: String,
                trim: true,
                match: [
                    userConstants.pattern.NAME,
                    'Invalid middle name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".'
                ],
                minlength: [
                    userConstants.lengths.NAME.MIDDLE_MIN,
                    `Name should be at least ${userConstants.lengths.NAME.MIDDLE_MIN} characters.`,
                ],
                maxlength: [
                    userConstants.lengths.NAME.MIDDLE_MAX,
                    `Name should not exceed ${userConstants.lengths.NAME.MIDDLE_MAX} characters.`,
                ],
                description:
                    'User’s middle name; must meet minimum and maximum length requirements.',
            },
            last: {
                type: String,
                trim: true,
                match: [
                    userConstants.pattern.NAME,
                    'Invalid last name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".'
                ],
                minlength: [
                    userConstants.lengths.NAME.LAST_MIN,
                    `Name should be at least ${userConstants.lengths.NAME.LAST_MIN} characters.`,
                ],
                maxlength: [
                    userConstants.lengths.NAME.LAST_MAX
                    `Name should not exceed ${userConstants.lengths.NAME.LAST_MAX} characters.`,
                ],
                description:
                    'User’s last name; must meet minimum and maximum length requirements.',
            },
            nick: {
                type: String,
                trim: true,
                match: [
                    userConstants.pattern.NAME,
                    'Invalid nick name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".'
                ],
                minlength: [
                    userConstants.lengths.NAME.NICK_MIN,
                    `Name should be at least ${userConstants.lengths.NAME.NICK_MIN} characters.`,
                ],
                maxlength: [
                    userConstants.lengths.NAME.NICK_MAX,
                    `Name should not exceed ${userConstants.lengths.NAME.NICK_MAX} characters.`,
                ],
                description:
                    'User’s nickname; must meet minimum and maximum length requirements.',
            },
        },
        // TODO: validate unique username
        // TODO: suggest unique username when updating
        username: {
            type: String,
            trim: true,
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
        image: {
            fileId: {
                type: String,
                trim: true,
                maxlength: [constants.lengths.IMAGE.FILE_ID_MAX, `File ID should not exceed ${constants.lengths.IMAGE.FILE_ID_MAX} characters.`],
                description:
                    'Identifier for an image file stored in a file system or external service.',
            },
            shareableLink: {
                type: String,
                trim: true,
                maxlength: [
                    constants.lengths.IMAGE.SHAREABLE_LINK,
                    `Shareable link should not exceed ${constants.lengths.IMAGE.SHAREABLE_LINK} characters.`,
                ],
                description:
                    "URL link that allows others to access the user's image.",
            },
            downloadLink: {
                type: String,
                trim: true,
                maxlength: [
                    constants.lengths.IMAGE.DOWNLOAD_LINK,
                    `Download link should not exceed ${constants.lengths.IMAGE.DOWNLOAD_LINK} characters.`,
                ],
                description: "URL link to directly download the user's image.",
            },
            description: 'Image file management for user profile.',
        },
        dateOfBirth: {
            type: Date,
            trim: true,
            required: [true, 'Your date of birth is required.'],
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
        // TODO: create PronounsModel
        // TODO: set default pronouns
        pronouns: {
            type: Schema.Types.ObjectId,
            trim: true,
            ref: 'PronounsModel',
            required: [true, 'Please select your pronouns.'],
            description:
                'Reference to an external Pronouns model, ensuring pronouns are selected from a predefined list.',
        },

        // Contact Information
        emails: [
            {
                type: String,
                trim: true,
                sparse: true,
                unique: [true, 'This email address is already in use. Please use a different email address.'],
                required: [true, 'An email address is required to register.'],
                match: [patterns.EMAIL, 'Invalid email format. Please enter a valid email address.'],
                minlength: [
                    constants.lengths.EMAIL_MIN,
                    `Email should be at least ${constants.lengths.EMAIL_MIN} characters long.`
                ],
                maxlength: [
                    constants.lengths.EMAIL_MAX,
                    `Email should not exceed ${constants.lengths.EMAIL_MAX} characters long.`
                ],
                description: "User's email, each validated for uniqueness and proper format.",

                // Flag to indicate primary email
                isPrimaryEmail: {
                    type: Boolean,
                    default: false,
                    description: 'Indicates if this is the primary email for the user. Only one email should be set as primary at any time.'
                },

                // Verification status of the email
                isEmailVerified: {
                    type: Boolean,
                    default: false,
                    description: 'Flag to indicate whether the user’s email has been verified.'
                },

                // Token for email verification
                emailVerifyToken: {
                    type: String,
                    trim: true,
                    description: 'Token used for email verification process.'
                },

                // Expiry date for the email verification token
                emailVerifyTokenExpires: {
                    type: Date,
                    trim: true,
                    description: 'Expiration date and time for the email verification token.'
                }
            }
        ],
        mobiles: [
            {
                type: String,
                trim: true,
                sparse: true,
                unique: [true, 'This mobile number is already registered. Please use a different mobile number.'],
                match: [
                    patterns.MOBILE,
                    'Invalid mobile number format. Please enter a valid mobile number.'
                ],
                minlength: [
                    constants.lengths.MOBILE_MIN,
                    `Mobile number should have at least ${constants.lengths.MOBILE_MIN} digits.`
                ],
                maxlength: [
                    constants.lengths.MOBILE_MAX,
                    `Mobile number should not exceed ${constants.lengths.MOBILE_MAX} digits.`
                ],
                description: "User's mobile number, must be unique and properly formatted.",

                // Verification status of the mobile number
                isPhoneVerified: {
                    type: Boolean,
                    default: false,
                    description: 'Flag to indicate whether the user’s phone number has been verified.'
                },

                // Flag to indicate primary mobile
                isPrimaryEmail: {
                    type: Boolean,
                    default: false,
                    description: 'Indicates if this is the primary mobile for the user. Only one mobile should be set as primary at any time.'
                },

                // Token for phone number verification
                phoneVerifyToken: {
                    type: String,
                    trim: true,
                    description: 'Token used for phone number verification process.'
                },

                // Expiry date for the phone verification token
                phoneVerifyTokenExpires: {
                    type: Date,
                    trim: true,
                    description: 'Expiration date and time for the phone verification token.'
                }
            }
        ],

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
            type: String,
            trim: true,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
            description:
                "Defines the user's role within the application, restricting access based on role.",
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
                'Token used to verify the user’s identity for password reset process.',
        },
        resetPasswordVerifyTokenExpires: {
            type: Date,
            trim: true,
            description:
                'Expiration date and time for the reset password verification token.',
        },

        // Professional Information
        company: {
            // TODO: suggest company name when a user try to add company
            name: {
                type: String,
                trim: true,
                maxlength: [
                    userConstants.lengths.COMPANY.NAME_MAX,
                    `Company name should not exceed ${userConstants.lengths.COMPANY.NAME_MAX} characters.`,
                ],
                description:
                    "Optional field for storing the name of the user's employer, with validation on length.",
            },
            website: {
                type: String,
                trim: true,
                match: [
                    patterns.URL,
                    'Invalid website format. Please enter a valid website.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
                description:
                    'A unique URL associated with the user, typically for a personal or professional website.',
            },
            facebook: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This Facebook URL is already linked to another account.',
                ],
                match: [
                    patterns.FACEBOOK_URL,
                    'Invalid facebook url format. Please enter a valid facebook url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your Facebook URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
            twitter: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This Twitter handle is already linked to another account.',
                ],
                match: [
                    patterns.TWITTER_URL,
                    'Invalid twitter url format. Please enter a valid twitter url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your Twitter handle must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
            linkedIn: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This LinkedIn profile is already linked to another account.',
                ],
                match: [
                    patterns.LINKEDIN_URL,
                    'Invalid linkedIn url format. Please enter a valid linkedIn url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your LinkedIn URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
            github: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This GitHub username is already linked to another account.',
                ],
                match: [
                    patterns.GITHUB_URL,
                    'Invalid github url format. Please enter a valid github url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your GitHub username must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
        },

        // Social and External Accounts
        url: {
            type: String,
            trim: true,
            match: [
                patterns.URL,
                'Invalid url format. Please enter a valid url.'
            ],
            maxlength: [
                constants.lengths.WEBSITE_URL_MAX,
                `Your URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
            ],
            description:
                'A unique URL associated with the user, typically for a personal or professional website.',
        },
        socialAccounts: {
            facebook: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This Facebook URL is already linked to another account.',
                ],
                match: [
                    patterns.FACEBOOK_URL,
                    'Invalid facebook url format. Please enter a valid facebook url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your Facebook URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
            twitter: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This Twitter handle is already linked to another account.',
                ],
                match: [
                    patterns.TWITTER_URL,
                    'Invalid twitter url format. Please enter a valid twitter url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your Twitter handle must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
            linkedIn: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This LinkedIn profile is already linked to another account.',
                ],
                match: [
                    patterns.LINKEDIN_URL,
                    'Invalid linkedIn url format. Please enter a valid linkedIn url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your LinkedIn URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
            github: {
                type: String,
                trim: true,
                unique: [
                    true,
                    'This GitHub username is already linked to another account.',
                ],
                match: [
                    patterns.GITHUB_URL,
                    'Invalid github url format. Please enter a valid github url.'
                ],
                maxlength: [
                    constants.lengths.WEBSITE_URL_MAX,
                    `Your GitHub username must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
                ],
            },
            description:
                "Social media accounts linked to the user's profile, each requiring uniqueness.",
        },
        externalOAuth: {
            googleId: {
                type: String,
                trim: true,
                sparse: true,
                unique: [true, 'This Google account is already registered.'],
                maxlength: [
                    constants.lengths.EXTERNAL_AUTH_ID_MAX,
                    `The Google ID must be less than ${constants.lengths.EXTERNAL_AUTH_ID_MAX} characters.`,
                ],
            },
            facebookId: {
                type: String,
                trim: true,
                sparse: true,
                unique: [true, 'This Facebook account is already registered.'],
                maxlength: [
                    constants.lengths.EXTERNAL_AUTH_ID_MAX,
                    `The Facebook ID must be less than ${constants.lengths.EXTERNAL_AUTH_ID_MAX} characters.`,
                ],
            },
            twitterId: {
                type: String,
                trim: true,
                sparse: true,
                unique: [true, 'This Twitter account is already registered.'],
                maxlength: [
                    constants.lengths.EXTERNAL_AUTH_ID_MAX,
                    `The Twitter ID must be less than ${constants.lengths.EXTERNAL_AUTH_ID_MAX} characters.`,
                ],
            },
            linkedInId: {
                type: String,
                trim: true,
                sparse: true,
                unique: [true, 'This LinkedIn account is already registered.'],
                maxlength: [
                    constants.lengths.EXTERNAL_AUTH_ID_MAX,
                    `The LinkedIn ID must be less than ${constants.lengths.EXTERNAL_AUTH_ID_MAX} characters.`,
                ],
            },
            githubId: {
                type: String,
                trim: true,
                sparse: true,
                unique: [true, 'This GitHub account is already registered.'],
                maxlength: [
                    constants.lengths.EXTERNAL_AUTH_ID_MAX,
                    `The GitHub ID must be less than ${constants.lengths.EXTERNAL_AUTH_ID_MAX} characters.`,
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
                        details: {
                            type: String,
                            description: 'Detailed information about the device used during the failed attempt, such as device type, browser, and IP address.'
                        },
                        dateTime: {
                            type: Date,
                            description: 'The exact date and time when the failed login attempt occurred.'
                        },
                        description: 'Records the details of failed login attempts including the device used and the time of attempt. This information is crucial for understanding security vulnerabilities and potential breach attempts.'
                    },
                ],
                description: 'Array of objects that store information on each failed login attempt. This data helps monitor and analyze unauthorized access attempts for security purposes.'
            },
            successful: {
                device: [
                    {
                        details: {
                            type: String,
                            description: 'Detailed information about the device used during the successful login, such as device type, browser, and IP address.'
                        },
                        dateTime: {
                            type: Date,
                            description: 'The exact date and time when the successful login occurred.'
                        },
                        description: 'Records successful login attempts for security audits and user analytics. Tracking successful logins helps in analyzing user behavior and system usage patterns.'
                    },
                ],
                description: 'Array of objects that capture data on each successful login attempt. This information is used to ensure user authenticity and monitor account activity.'
            },
            description: 'Manages records of login attempts, both failed and successful, for security and auditing purposes. This section is essential for maintaining a secure and robust authentication mechanism.'
        },
        sessions: [
            {
                token: {
                    type: String,
                    trim: true,
                    required: [
                        true,
                        'A session token is required. This token is crucial for authenticating user sessions and ensuring secure interaction with the application.'
                    ],
                    description: 'A unique session token that is used to authenticate user sessions. This token is generated upon successful login and is necessary to access secure parts of the application.'
                },
                expiresAt: {
                    type: Date,
                    trim: true,
                    required: [
                        true,
                        'An expiration date for the session token is required. Setting an expiration date helps maintain security by invalidating the session token after a period of time.'
                    ],
                    description: 'The date and time when the session token expires. This mechanism is used to ensure that sessions are automatically terminated after a certain period, enhancing the security by preventing old session tokens from being used indefinitely.'
                },
                description: 'Each session object manages essential details about user sessions, including the session token and its expiry. This information is crucial for ensuring that sessions are secure, authenticated, and appropriately limited in duration. The management of these sessions is fundamental to the security and auditing mechanisms of the application.'
            },
        ],

        // Activity Tracking and Privacy
        activities: [
            {
                action: {
                    type: String,
                    required: [true, 'Recording the type of action is necessary to track user activities accurately.'],
                    description: 'Describes the type of activity performed by the user, such as login, logout, data entry, etc.'
                },
                date: {
                    type: Date,
                    default: Date.now,
                    description: 'The exact date and time when the activity occurred. Automatically set to the current date and time by default.'
                },
                metadata: {
                    type: Schema.Types.Mixed,
                    description: 'Additional details associated with the activity, stored in a flexible schema-less format. This can include specifics like IP address, device used, location, or other context-specific data.'
                },
                description: 'Tracks user activities for analytics and monitoring purposes. Each activity record provides insights into user behavior, system usage, and potential security events, aiding in both operational management and security auditing.'
            },
        ],
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
            description:
                'Manages user-specific privacy settings, including profile visibility options.',
        },

        isActive: {
            type: Boolean,
            trim: true,
            default: true,
            description:
                'Flag to indicate whether the user’s account is active or deactivated.',
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
