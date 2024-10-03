import siteMapSchema from './siteMap.schema.js';

import validateWithSchema from '../../../../shared/validateWithSchema.js';

const createSiteMap = validateWithSchema([
    {
        schema: siteMapSchema.createSiteMapSchema,
        property: 'body',
    },
]);

const getSiteMap = validateWithSchema([
    {
        schema: siteMapSchema.getSiteMapQuerySchema,
        property: 'query',
    },
]);

const updateSiteMap = validateWithSchema([
    {
        schema: siteMapSchema.updateSiteMapSchema,
        property: 'body',
    },
]);

const siteMapValidator = {
    createSiteMap,
    getSiteMap,
    updateSiteMap,
};

export default siteMapValidator;
