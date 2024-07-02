import validateWithSchema from '../../../shared/validateWithSchema.js';
import subjectsSchema from './subjects.schema.js';

const createSubject = validateWithSchema(subjectsSchema.createSubjectSchema, 'body');
const getSubjects = validateWithSchema(subjectsSchema.getSubjectsQuerySchema, 'query');
const getSubject = validateWithSchema(subjectsSchema.subjectIdParamSchema, 'params');
const updateSubject = validateWithSchema(subjectsSchema.updateSubjectSchema, 'body');
const deleteSubjects = validateWithSchema(subjectsSchema.subjectIdsParamSchema, 'query');
const deleteSubject = validateWithSchema(subjectsSchema.subjectIdParamSchema, 'params');

const subjectsValidator = {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubjects,
    deleteSubject,
};

export default subjectsValidator;
