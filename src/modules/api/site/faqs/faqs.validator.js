import faqsSchema from './faqs.schema.js';

import validateWithSchema from '../../../../shared/validateWithSchema.js';

const createFaq = validateWithSchema([
    { schema: faqsSchema.createFaqSchema, property: 'body' },
]);

const getFaqList = validateWithSchema([
    { schema: faqsSchema.getFaqsQuerySchema, property: 'query' },
]);

const getFaqById = validateWithSchema([
    {
        schema: faqsSchema.faqIdParamSchema,
        property: 'params',
    },
]);

const updateFaqById = validateWithSchema([
    { schema: faqsSchema.faqIdParamSchema, property: 'params' },
    { schema: faqsSchema.updateFaqSchema, property: 'body' },
]);

const deleteFaqList = validateWithSchema([
    {
        schema: faqsSchema.faqIdsParamSchema,
        property: 'query',
    },
]);

const deleteFaqById = validateWithSchema([
    {
        schema: faqsSchema.faqIdParamSchema,
        property: 'params',
    },
]);

const faqsValidator = {
    createFaq,
    getFaqList,
    getFaqById,
    updateFaqById,
    deleteFaqList,
    deleteFaqById,
};

export default faqsValidator;
