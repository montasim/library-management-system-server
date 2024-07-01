const customValidationMessage = {
    'string.empty': `{#label} cannot be empty`,
    'string.min': `{#label} should have a minimum length of {#limit}`,
    'number.min': `{#label} should be at least {#limit}`,
    'number.max': `{#label} should be no more than {#limit}`,
    'any.required': `{#label} is a required field`,
    'number.base': `{#label} must be a number`,
    'string.uri': `{#label} must be a valid URI`,
    'string.alphanum': `{#label} must be alphanumeric`,
    'number.integer': `{#label} must be an integer`,
    'array.base': `{#label} must be an array`,
};

export default customValidationMessage;
