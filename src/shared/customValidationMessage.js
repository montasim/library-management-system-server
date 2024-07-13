const customValidationMessage = {
    'string.empty': `{#label} cannot be empty.`,
    'string.min': `{#label} should have a minimum length of {#limit}.`,
    'string.max': `{#label} should not exceed a maximum length of {#limit}.`,
    'number.base': `{#label} must be a number.`,
    'number.integer': `{#label} must be an integer.`,
    'number.min': `{#label} should not be less than {#limit}.`,
    'number.max': `{#label} should not exceed {#limit}.`,
    'array.base': `{#label} must be an array.`,
    'boolean.base': '{#label} must be a boolean.',
    'any.required': `{#label} is required.`,
    'objectid.base': `{#label} must be a valid MongoDB ObjectId.`,
};

export default customValidationMessage;
