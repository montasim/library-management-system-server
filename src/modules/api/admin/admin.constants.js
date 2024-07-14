const lengths = {
    NAME_MIN: 2,
    NAME_MAX: 50,

    EMAIL_MIN: 5,
    EMAIL_MAX: 100,

    MOBILE_MIN: 11,
    MOBILE_MAX: 14,

    ADDRESS_MIN: 2,
    ADDRESS_MAX: 200,

    DEPARTMENT_MIN: 2,
    DEPARTMENT_MAX: 100,

    DESIGNATION_MIN: 2,
    DESIGNATION_MAX: 100,

    PASSWORD_MIN: 8,
    PASSWORD_MAX: 30,
};

const pattern = {
    name: /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/,
};

const imageSize = 1.1 * 1024 * 1024; // 1.1 MB

const adminConstants = {
    lengths,
    pattern,
    imageSize,
};

export default adminConstants;
