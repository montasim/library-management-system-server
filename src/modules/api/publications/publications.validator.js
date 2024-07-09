import validateWithSchema from '../../../shared/validateWithSchema.js';
import publicationsSchema from './publications.schema.js';

const createPublication = validateWithSchema([
    {
        schema: publicationsSchema.createPublicationSchema,
        property: 'body',
    },
]);

const getPublications = validateWithSchema([
    {
        schema: publicationsSchema.getPublicationsQuerySchema,
        property: 'query',
    },
]);

const getPublication = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
]);

const updatePublication = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
    {
        schema: publicationsSchema.updatePublicationSchema,
        property: 'body',
    },
]);

const deletePublications = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdsParamSchema,
        property: 'query',
    },
]);

const deletePublication = validateWithSchema([
    {
        schema: publicationsSchema.publicationIdParamSchema,
        property: 'params',
    },
]);

const publicationsValidator = {
    createPublication,
    getPublications,
    getPublication,
    updatePublication,
    deletePublications,
    deletePublication,
};

export default publicationsValidator;
