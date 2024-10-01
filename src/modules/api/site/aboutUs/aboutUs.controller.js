import aboutUsService from './aboutUs.service.js';
import controller from '../../../../shared/controller.js';
import routesConstants from '../../../../constant/routes.constants.js';

const aboutUsController = {
    createAboutUs: controller.create(aboutUsService, 'createAboutUs'),
    getAboutUs: controller.getList(aboutUsService, 'getAboutUs'),
    updateAboutUs: controller.updateById(
        aboutUsService,
        'updateAboutUs',
        routesConstants.aboutUs.params
    ),
    deleteAboutUs: controller.deleteAll(aboutUsService, 'deleteAboutUs'),
};

export default aboutUsController;
