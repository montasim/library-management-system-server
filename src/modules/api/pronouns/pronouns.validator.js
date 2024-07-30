import validateWithSchema from '../../../shared/validateWithSchema.js';
import pronounsSchema from './pronouns.schema.js';

const createPronouns = validateWithSchema([
    { schema: pronounsSchema.createPronounsSchema, property: 'body' },
]);

const getPronounsList = validateWithSchema([
    { schema: pronounsSchema.getPronounsQuerySchema, property: 'query' },
]);

const getPronounsById = validateWithSchema([
    {
        schema: pronounsSchema.pronounsIdParamSchema,
        property: 'params',
    },
]);

const updatePronounsById = validateWithSchema([
    { schema: pronounsSchema.pronounsIdParamSchema, property: 'params' },
    { schema: pronounsSchema.updatePronounsSchema, property: 'body' },
]);

const deletePronounsList = validateWithSchema([
    {
        schema: pronounsSchema.pronounsIdsParamSchema,
        property: 'query',
    },
]);

const deletePronounsById = validateWithSchema([
    {
        schema: pronounsSchema.pronounsIdParamSchema,
        property: 'params',
    },
]);

const pronounsValidator = {
    createPronouns,
    getPronounsList,
    getPronounsById,
    updatePronounsById,
    deletePronounsList,
    deletePronounsById,
};

export default pronounsValidator;
