import validateWithSchema from '../../../shared/validateWithSchema.js';
import subjectsSchema from './subjects.schema.js';

const createSubject = validateWithSchema([
    {
        schema: subjectsSchema.createSubjectSchema,
        property: 'body',
    },
]);

const getSubjects = validateWithSchema([
    {
        schema: subjectsSchema.getSubjectsQuerySchema,
        property: 'query',
    },
]);

const getSubject = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdParamSchema,
        property: 'params',
    },
]);

const updateSubject = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdParamSchema,
        property: 'params',
    },
    {
        schema: subjectsSchema.updateSubjectSchema,
        property: 'body',
    },
]);

const deleteSubjects = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdsParamSchema,
        property: 'query',
    },
]);

const deleteSubject = validateWithSchema([
    {
        schema: subjectsSchema.subjectIdParamSchema,
        property: 'params',
    },
]);

const subjectsValidator = {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsValidator;
