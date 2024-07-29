const privacySettingsRules = {
    PUBLIC: ['name', 'username', 'bio'],
    FRIENDS: ['name', 'username', 'dateOfBirth', 'bio', 'pronouns', 'company', 'socialAccounts', 'url'],
    PRIVATE: [],
    ITSELF: ['name','username', 'image', 'dateOfBirth', 'bio', 'pronouns', 'emails', 'mobiles', 'address', 'twoFactorEnabled', 'company', 'url', 'socialAccounts', 'privacySettings'],
    ADMIN: ['*'],
};

export default privacySettingsRules;
