import subjectsService from './subjects.service.js';
import entity from '../../../shared/entity.js';
import routesConstants from '../../../constant/routes.constants.js';

const subjectsController = {
    createSubject: entity.createEntity(subjectsService, 'createSubject'),
    getSubjects: entity.getEntityList(subjectsService, 'getSubjects'),
    getSubjectById: entity.getEntityById(subjectsService, 'getSubjectById', routesConstants.subjects.params),
    updateSubject: entity.updateEntityById(subjectsService, 'updateSubject', routesConstants.subjects.params),
    deleteSubject: entity.deleteEntityById(subjectsService, 'deleteSubject', routesConstants.subjects.params),
    deleteSubjects: entity.deleteEntityList(subjectsService, 'deleteSubjects'),
};

export default subjectsController;
