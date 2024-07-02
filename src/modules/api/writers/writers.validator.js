import validateWithSchema from '../../../shared/validateWithSchema.js';
import writersSchema from './writers.schema.js';

const createWriter = validateWithSchema(
    writersSchema.createWriterSchema,
    'body'
);
const getWriters = validateWithSchema(
    writersSchema.getWritersQuerySchema,
    'query'
);
const getWriter = validateWithSchema(
    writersSchema.writerIdParamSchema,
    'params'
);
const updateWriter = validateWithSchema(
    writersSchema.updateWriterSchema,
    'body'
);
const deleteWriters = validateWithSchema(
    writersSchema.writerIdsParamSchema,
    'query'
);
const deleteWriter = validateWithSchema(
    writersSchema.writerIdParamSchema,
    'params'
);

const writersValidator = {
    createWriter,
    getWriters,
    getWriter,
    updateWriter,
    deleteWriters,
    deleteWriter,
};

export default writersValidator;
