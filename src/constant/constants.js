const lengths = {
    WEBSITE_URL_MAX: 50,

    USERNAME_MIN: 3,
    USERNAME_MAX: 10,

    EMAIL_MIN: 5,
    EMAIL_MAX: 100,

    MOBILE_MIN: 11,
    MOBILE_MAX: 14,

    PASSWORD_MIN: 8,
    PASSWORD_MAX: 30,

    EXTERNAL_AUTH_ID_MAX: 100,

    IMAGE: {
        FILE_ID_MAX: 100,
        SHAREABLE_LINK: 500,
        DOWNLOAD_LINK: 500,
    },
};

const urls = {
    FACEBOOK: 'https://www.facebook.com',
    TWITTER: 'https://twitter.com',
    LINKEDIN: 'https://linkedin.com',
    GITHUB: 'https://github.com',
};

const constants = {
    lengths,
    urls
};

export default constants;
