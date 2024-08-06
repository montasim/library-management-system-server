import writersService from './writers.service.js';
import controller from '../../../shared/controller.js';
import routesConstants from '../../../constant/routes.constants.js';

const writersController = {
    createWriter: controller.create(writersService, 'createWriter'),
    getWriters: controller.getList(writersService, 'getWriters'),
    getWriter: controller.getById(
        writersService,
        'getWriter',
        routesConstants.writers.params
    ),
    updateWriter: controller.updateById(
        writersService,
        'updateWriter',
        routesConstants.writers.params
    ),
    deleteWriter: controller.deleteById(
        writersService,
        'deleteWriter',
        routesConstants.writers.params
    ),
    deleteWriters: controller.deleteList(writersService, 'deleteWriters'),
};

export default writersController;
