import aboutUsSchema from './aboutUs.schema.js';

import validateWithSchema from '../../../../shared/validateWithSchema.js';

const createAboutUs = validateWithSchema([
    {
        schema: aboutUsSchema.createAboutUsSchema,
        property: 'body',
    },
]);

const getAboutUs = validateWithSchema([
    {
        schema: aboutUsSchema.getAboutUsQuerySchema,
        property: 'query',
    },
]);

const updateAboutUs = validateWithSchema([
    {
        schema: aboutUsSchema.updateAboutUsSchema,
        property: 'body',
    },
]);

const aboutUsValidator = {
    createAboutUs,
    getAboutUs,
    updateAboutUs,
};

export default aboutUsValidator;
