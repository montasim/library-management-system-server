const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,
};

const pattern = {
    name: /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/,
};

const subjectsConstants = {
    lengths,
    pattern,
};

export default subjectsConstants;
