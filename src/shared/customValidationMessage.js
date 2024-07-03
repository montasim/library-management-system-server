const customValidationMessage = {
    'string.empty': `{#label} cannot be empty`,
    'string.min': `{#label} should have a minimum length of {#limit}`,
    'string.uri': `{#label} must be a valid URI`,
    'string.alphanum': `{#label} must be alphanumeric`,
    'number.base': `{#label} must be a number`,
    'number.integer': `{#label} must be an integer`,
    'number.min': `{#label} should be at least {#limit}`,
    'number.max': `{#label} should be no more than {#limit}`,
    'array.base': `{#label} must be an array`,
    'array.min': `At least one {#label} must be specified.`,
    'boolean.base': '{#label} must be a boolean.',
    'any.required': `{#label} is a required field`,
};

export default customValidationMessage;
