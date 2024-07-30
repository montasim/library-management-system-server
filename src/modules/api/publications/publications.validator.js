import validateWithSchema from '../../../shared/validateWithSchema.js';
import publicationsSchema from './publications.schema.js';

const createPublication = validateWithSchema([
    {
        schema: publicationsSchema.createPublicationSchema,
        property: 'body',
    },
]);

const getPublicationList = validateWithSchema([
    {
        schema: publicationsSchema.getPublicationsQuerySchema,
        property: 'query',
    },
]);

const getPublicationById = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
]);

const updatePublicationById = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
    {
        schema: publicationsSchema.updatePublicationSchema,
        property: 'body',
    },
]);

const deletePublicationList = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdsParamSchema,
        property: 'query',
    },
]);

const deletePublicationById = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
]);

const publicationsValidator = {
    createPublication,
    getPublicationList,
    getPublicationById,
    updatePublicationById,
    deletePublicationList,
    deletePublicationById,
};

export default publicationsValidator;
