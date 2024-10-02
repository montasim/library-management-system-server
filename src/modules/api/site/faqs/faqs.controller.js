import controller from '../../../../shared/controller.js';
import faqsService from './faqs.service.js';
import routesConstants from '../../../../constant/routes.constants.js';

const faqsController = {
    createFaq: controller.create(faqsService, 'createFaq'),

    getFaqList: controller.getList(
        faqsService,
        'getFaqList'
    ),

    getFaqById: controller.getById(
        faqsService,
        'getFaqById',
        routesConstants.faqs.params
    ),

    updateFaqById: controller.updateById(
        faqsService,
        'updateFaqById',
        routesConstants.faqs.params
    ),

    deleteFaqById: controller.deleteById(
        faqsService,
        'deleteFaqById',
        routesConstants.faqs.params
    ),

    deleteFaqList: controller.deleteList(
        faqsService,
        'deleteFaqList'
    ),
};

export default faqsController;
