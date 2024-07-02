import validateWithSchema from '../../../shared/validateWithSchema.js';
import publicationsSchema from './publications.schema.js';

const createPublication = validateWithSchema(
    publicationsSchema.createPublicationSchema,
    'body'
);
const getPublications = validateWithSchema(
    publicationsSchema.getPublicationsQuerySchema,
    'query'
);
const getPublication = validateWithSchema(
    publicationsSchema.publicationIdParamSchema,
    'params'
);
const updatePublication = validateWithSchema(
    publicationsSchema.updatePublicationSchema,
    'body'
);
const deletePublications = validateWithSchema(
    publicationsSchema.publicationIdsParamSchema,
    'query'
);
const deletePublication = validateWithSchema(
    publicationsSchema.publicationIdParamSchema,
    'params'
);

const publicationsValidator = {
    createPublication,
    getPublications,
    getPublication,
    updatePublication,
    deletePublications,
    deletePublication,
};

export default publicationsValidator;
