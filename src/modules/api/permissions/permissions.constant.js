const lengths = {
    NAME_MIN: 3,
    NAME_MAX: 100,
};

const pattern = {
    name: /^[a-z]+(-[a-z]+)+$/,
};

const message = {
    pattern: {
        name: 'Name must be in the format of "action-route" (e.g., "create-survey", "edit-survey"). No number is allowed.',
    },
};

const permissionsConstants = {
    lengths,
    pattern,
    message,
};

export default permissionsConstants;
