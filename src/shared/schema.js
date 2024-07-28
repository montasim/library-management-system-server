import { Schema } from 'mongoose';

import constants from '../constant/constants.js';
import userConstants from '../modules/api/users/users.constants.js';
import patterns from '../constant/patterns.constants.js';

// Define the shared image schema
const imageSchema = new Schema({
    fileId: {
        type: String,
        trim: true,
        maxlength: [
            constants.lengths.IMAGE.FILE_ID_MAX,
            `File ID should not exceed ${constants.lengths.IMAGE.FILE_ID_MAX} characters.`,
        ],
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
});

// Define the shared name schema
const nameSchema = new Schema({
    first: {
        type: String,
        trim: true,
        required: [
            true,
            'Please enter your name to create your profile.',
        ],
        match: [
            userConstants.pattern.NAME,
            'Invalid name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".',
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
            "User's name; must meet minimum and maximum length requirements.",
    },
    middle: {
        type: String,
        trim: true,
        match: [
            userConstants.pattern.NAME,
            'Invalid middle name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".',
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
            "User's middle name; must meet minimum and maximum length requirements.",
    },
    last: {
        type: String,
        trim: true,
        match: [
            userConstants.pattern.NAME,
            'Invalid last name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".',
        ],
        minlength: [
            userConstants.lengths.NAME.LAST_MIN,
            `Name should be at least ${userConstants.lengths.NAME.LAST_MIN} characters.`,
        ],
        maxlength: [
            userConstants.lengths.NAME.LAST_MAX,
            `Name should not exceed ${userConstants.lengths.NAME.LAST_MAX} characters.`,
        ],
        description:
            "User's last name; must meet minimum and maximum length requirements.",
    },
    nick: {
        type: String,
        trim: true,
        match: [
            userConstants.pattern.NAME,
            'Invalid nick name format. Names should only contain alphabetic characters and appropriate separators like spaces. For example, "John", "Mary Anne".',
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
            "User's nickname; must meet minimum and maximum length requirements.",
    },
});

// Define the shared address schema
const addressSchema = new Schema({
    country: {
        type: String,
        trim: true,
        description:
            'The country where the user resides. This field stores the name of the country as a string.',
    },
    state: {
        type: String,
        trim: true,
        description:
            'The state or region within the country where the user is located. This field is used to store the state or regional name.',
    },
    city: {
        type: String,
        trim: true,
        description:
            'The city or locality within the state where the user lives. This field captures the city name.',
    },
});

// Define the shared url schema
const urlSchema = new Schema({
    url: {
        type: String,
        trim: true,
        match: [
            patterns.URL,
            'Invalid website format. Please enter a valid website.',
        ],
        maxlength: [
            constants.lengths.WEBSITE_URL_MAX,
            `Your URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
        ],
        description:
            'A unique URL associated with the user, typically for a personal or professional website.',
    }
});

// Define the shared facebook schema
const facebookSchema = new Schema({
    facebook: {
        type: String,
        trim: true,
        sparse: true,
        unique: [
            true,
            'This Facebook URL is already linked to another account.',
        ],
        match: [
            patterns.FACEBOOK_URL,
            'Invalid facebook url format. Please enter a valid facebook url.',
        ],
        maxlength: [
            constants.lengths.WEBSITE_URL_MAX,
            `Your Facebook URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
        ],
        description:
            'The Facebook URL must be unique across all users and follow the predefined URL pattern.',
    }
});

// Define the shared twitter schema
const twitterSchema = new Schema({
    twitter: {
        type: String,
        trim: true,
        sparse: true,
        unique: [
            true,
            'This Twitter handle is already linked to another account.',
        ],
        match: [
            patterns.TWITTER_URL,
            'Invalid twitter url format. Please enter a valid twitter url.',
        ],
        maxlength: [
            constants.lengths.WEBSITE_URL_MAX,
            `Your Twitter handle must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
        ],
        description:
            'The Twitter handle must be unique and comply with a specific URL format.',
    }
});

// Define the shared linkedIn schema
const linkedInSchema = new Schema({
    linkedIn: {
        type: String,
        trim: true,
        sparse: true,
        unique: [
            true,
            'This LinkedIn profile is already linked to another account.',
        ],
        match: [
            patterns.LINKEDIN_URL,
            'Invalid linkedIn url format. Please enter a valid linkedIn url.',
        ],
        maxlength: [
            constants.lengths.WEBSITE_URL_MAX,
            `Your LinkedIn URL must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
        ],
        description:
            'LinkedIn URLs are unique to each user, adhering to the required LinkedIn format.',
    }
});

// Define the shared github schema
const githubSchema = new Schema({
    github: {
        type: String,
        trim: true,
        sparse: true,
        unique: [
            true,
            'This GitHub username is already linked to another account.',
        ],
        match: [
            patterns.GITHUB_URL,
            'Invalid github url format. Please enter a valid github url.',
        ],
        maxlength: [
            constants.lengths.WEBSITE_URL_MAX,
            `Your GitHub username must be less than ${constants.lengths.WEBSITE_URL_MAX} characters long.`,
        ],
        description:
            "GitHub's usernames need to follow a specific format and be unique among all system users.",
    }
});

// Define the shared company schema
const companySchema = new Schema({
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
    address: addressSchema,
    website: urlSchema,
    facebook: facebookSchema,
    twitter: twitterSchema,
    linkedIn: linkedInSchema,
    github: githubSchema,
});

// Define the shared externalOAuth schema
const externalOAuthSchema = new Schema({
    googleId: {
        type: String,
        trim: true,
        sparse: true,
        unique: [true, 'This Google account is already registered.'],
        maxlength: [
            constants.lengths.EXTERNAL_AUTH_ID_MAX,
            `The Google ID must be less than ${constants.lengths.EXTERNAL_AUTH_ID_MAX} characters.`,
        ],
        description:
            "Google ID is used for identifying user's Google account for OAuth authentication purposes. Must be unique.",
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
        description:
            "Facebook ID is used for identifying user's Facebook account in OAuth integrations. Ensures uniqueness in the system.",
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
        description:
            "Twitter ID is used for OAuth authentication and to link the user's Twitter profile to their account on this system. It must be unique.",
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
        description:
            "LinkedIn ID is uniquely associated with the user's LinkedIn account for authentication and profile linkage purposes.",
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
        description:
            "GitHub ID is a unique identifier used to link and authenticate the user's GitHub profile within our application.",
    },
});

// Define the shared login schema
const loginSchema = new Schema({
    failed: {
        device: [
            {
                details: {
                    type: String,
                    description:
                        'Detailed information about the device used during the failed attempt, such as device type, browser, and IP address.',
                },
                dateTime: {
                    type: Date,
                    description:
                        'The exact date and time when the failed login attempt occurred.',
                },
            },
        ],
    },
    successful: {
        device: [
            {
                details: {
                    type: String,
                    description:
                        'Detailed information about the device used during the successful login, such as device type, browser, and IP address.',
                },
                dateTime: {
                    type: Date,
                    description:
                        'The exact date and time when the successful login occurred.',
                },
            },
        ],
    },
});

// Define the shared sessions schema
const sessionsSchema = new Schema({
    token: {
        type: String,
        trim: true,
        required: [
            true,
            'A session token is required. This token is crucial for authenticating user sessions and ensuring secure interaction with the application.',
        ],
        description:
            'A unique session token that is used to authenticate user sessions. This token is generated upon successful login and is necessary to access secure parts of the application.',
    },
    expiresAt: {
        type: Date,
        trim: true,
        required: [
            true,
            'An expiration date for the session token is required. Setting an expiration date helps maintain security by invalidating the session token after a period of time.',
        ],
        description:
            'The date and time when the session token expires. This mechanism is used to ensure that sessions are automatically terminated after a certain period, enhancing the security by preventing old session tokens from being used indefinitely.',
    },
});

// Define the shared activities schema
const activitiesSchema = new Schema({
    action: {
        type: String,
        required: [
            true,
            'Recording the type of action is necessary to track user activities accurately.',
        ],
        description:
            'Describes the type of activity performed by the user, such as login, logout, data entry, etc.',
    },
    date: {
        type: Date,
        default: Date.now,
        description:
            'The exact date and time when the activity occurred. Automatically set to the current date and time by default.',
    },
    metadata: {
        type: Schema.Types.Mixed,
        description:
            'Additional details associated with the activity, stored in a flexible schema-less format. This can include specifics like IP address, device used, location, or other context-specific data.',
    },
});

const sharedSchema = {
    imageSchema,
    nameSchema,
    addressSchema,
    companySchema,
    urlSchema,
    facebookSchema,
    twitterSchema,
    linkedInSchema,
    githubSchema,
    externalOAuthSchema,
    loginSchema,
    sessionsSchema,
    activitiesSchema,
};

export default sharedSchema;
