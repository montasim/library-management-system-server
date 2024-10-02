import privacyPolicySchema from './privacyPolicy.schema.js';

import validateWithSchema from '../../../../shared/validateWithSchema.js';

const createPrivacyPolicy = validateWithSchema([
    {
        schema: privacyPolicySchema.createPrivacyPolicySchema,
        property: 'body',
    },
]);

const getPrivacyPolicy = validateWithSchema([
    {
        schema: privacyPolicySchema.getPrivacyPolicyQuerySchema,
        property: 'query',
    },
]);

const updatePrivacyPolicy = validateWithSchema([
    {
        schema: privacyPolicySchema.updatePrivacyPolicySchema,
        property: 'body',
    },
]);

const privacyPolicyValidator = {
    createPrivacyPolicy,
    getPrivacyPolicy,
    updatePrivacyPolicy,
};

export default privacyPolicyValidator;
