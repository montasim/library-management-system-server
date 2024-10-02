import termsAndConditionsSchema from './termsAndConditions.schema.js';

import validateWithSchema from '../../../../shared/validateWithSchema.js';

const createTermsAndConditions = validateWithSchema([
    {
        schema: termsAndConditionsSchema.createTermsAndConditionsSchema,
        property: 'body',
    },
]);

const getTermsAndConditions = validateWithSchema([
    {
        schema: termsAndConditionsSchema.getTermsAndConditionsQuerySchema,
        property: 'query',
    },
]);

const updateTermsAndConditions = validateWithSchema([
    {
        schema: termsAndConditionsSchema.updateTermsAndConditionsSchema,
        property: 'body',
    },
]);

const termsAndConditionsValidator = {
    createTermsAndConditions,
    getTermsAndConditions,
    updateTermsAndConditions,
};

export default termsAndConditionsValidator;
