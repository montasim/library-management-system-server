import writersService from './writers.service.js';
import entity from '../../../shared/entity.js';
import routesConstants from '../../../constant/routes.constants.js';

const writersController = {
    createWriter: entity.createEntity(writersService, 'createWriter'),
    getWriters: entity.getEntityList(writersService, 'getWriters'),
    getWriter: entity.getEntityById(
        writersService,
        'getWriter',
        routesConstants.writers.params
    ),
    updateWriter: entity.updateEntityById(
        writersService,
        'updateWriter',
        routesConstants.writers.params
    ),
    deleteWriter: entity.deleteEntityById(
        writersService,
        'deleteWriter',
        routesConstants.writers.params
    ),
    deleteWriters: entity.deleteEntityList(writersService, 'deleteWriters'),
};

export default writersController;
