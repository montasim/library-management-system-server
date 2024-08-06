import subjectsService from './subjects.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

const subjectsController = {
    createSubject: controller.create(subjectsService, 'createSubject'),
    getSubjects: controller.getList(subjectsService, 'getSubjects'),
    getSubjectById: controller.getById(
        subjectsService,
        'getSubjectById',
        routesConstants.subjects.params
    ),
    updateSubject: controller.updateById(
        subjectsService,
        'updateSubject',
        routesConstants.subjects.params
    ),
    deleteSubject: controller.deleteById(
        subjectsService,
        'deleteSubject',
        routesConstants.subjects.params
    ),
    deleteSubjects: controller.deleteList(subjectsService, 'deleteSubjects'),
};

export default subjectsController;
