import validateWithSchema from '../../../shared/validateWithSchema.js';
import pronounsSchema from './pronouns.schema.js';

const createPronouns = validateWithSchema([
    { schema: pronounsSchema.createPronounsSchema, property: 'body' },
]);

const getPronounses = validateWithSchema([
    { schema: pronounsSchema.getPronounsQuerySchema, property: 'query' },
]);

const getPronouns = validateWithSchema([
    {
        schema: pronounsSchema.pronounsIdParamSchema,
        property: 'params',
    },
]);

const updatePronouns = validateWithSchema([
    { schema: pronounsSchema.pronounsIdParamSchema, property: 'params' },
    { schema: pronounsSchema.updatePronounsSchema, property: 'body' },
]);

const deletePronounses = validateWithSchema([
    {
        schema: pronounsSchema.pronounsIdsParamSchema,
        property: 'query',
    },
]);

const deletePronouns = validateWithSchema([
    {
        schema: pronounsSchema.pronounsIdParamSchema,
        property: 'params',
    },
]);

const pronounsValidator = {
    createPronouns,
    getPronounses,
    getPronouns,
    updatePronouns,
    deletePronounses,
    deletePronouns,
};

export default pronounsValidator;
