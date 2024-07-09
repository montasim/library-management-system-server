import validateWithSchema from '../../../shared/validateWithSchema.js';
import writersSchema from './writers.schema.js';

const createWriter = validateWithSchema([
    {
        schema: writersSchema.createWriterSchema,
        property: 'body',
    },
]);

const getWriters = validateWithSchema([
    {
        schema: writersSchema.getWritersQuerySchema,
        property: 'query',
    },
]);

const getWriter = validateWithSchema([
    {
        schema: writersSchema.writerIdParamSchema,
        property: 'params',
    },
]);

const updateWriter = validateWithSchema([
    {
        schema: writersSchema.writerIdParamSchema,
        property: 'params',
    },
    {
        schema: writersSchema.updateWriterSchema,
        property: 'body',
    },
]);

const deleteWriters = validateWithSchema([
    {
        schema: writersSchema.writerIdsParamSchema,
        property: 'query',
    },
]);

const deleteWriter = validateWithSchema([
    {
        schema: writersSchema.writerIdParamSchema,
        property: 'params',
    },
]);

const writersValidator = {
    createWriter,
    getWriters,
    getWriter,
    updateWriter,
    deleteWriters,
    deleteWriter,
};

export default writersValidator;
